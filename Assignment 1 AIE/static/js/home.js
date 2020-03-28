
// namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/people',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(student_id, fname, lname, DOB, amount_due) {
            let ajax_options = {
                type: 'POST',
                url: 'api/people',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'student_id': student_id,
                    'fname': fname,
                    'lname': lname,
                    'DOB': DOB,
                    'amount_due': amount_due
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(student_id, fname, lname, DOB, amount_due) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/people/' + lname,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                  'student_id': student_id,
                  'fname': fname,
                  'lname': lname,
                  'DOB': DOB,
                  'amount_due': amount_due
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(lname) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/people/' + lname,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $student_id = $('#student_id'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $DOB = $("#DOB"),
        $amount_due = $('#amount_due');

    // return the API
    return {
        reset: function() {
            $student_id.val('');
            $lname.val('');
            $fname.val('').focus();
            $DOB.val('');
            $amount_due.val('');
        },
        update_editor: function(student_id, fname, lname, DOB, amount_due) {
            $student_id.val(student_id);
            $lname.val(lname);
            $fname.val(fname).focus();
            $DOB.val(DOB);
            $amount_due.val(amount_due);
        },
        build_table: function(people) {
            let rows = ''

            // clear the table
            $('.people table > tbody').empty();

            // did we get a people array?
            if (people) {
                for (let i=0, l=people.length; i < l; i++) {
                    rows += `<tr><td class="student_id">${people[i].student_id}</td><td class="fname">${people[i].fname}</td><td class="lname">${people[i].lname}</td><td>${people[i].DOB}</td><td class="amount_due">${people[i].amount_due}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),

        $student_id = $('#student_id'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $DOB = $('#DOB'),
        $amount_due = $('#amount_due');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(student_id,fname, lname, DOB, amount_due) {
        return fname !== "" && lname !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let student_id = $student_id.val(),
            fname = $fname.val(),
            lname = $lname.val(),
            DOB = $DOB.val(),
            amount_due = $amount_due.val();

        e.preventDefault();

        if (validate(student_id,fname, lname, DOB, amount_due)) {
            model.create(student_id,fname, lname, DOB, amount_due)
        } else {
            alert('Problem with input');
        }
    });

    $('#update').click(function(e) {
        let student_id = $student_id.val(),
            fname = $fname.val(),
            lname = $lname.val(),
            DOB = $DOB.val(),
            amount_due = $amount_due.val();

        e.preventDefault();

        if (validate(student_id,fname, lname, DOB, amount_due)) {
            model.update(student_id,fname, lname, DOB, amount_due)
        } else {
            alert('Problem with input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let lname = $lname.val();

        e.preventDefault();

        if (validate('placeholder', lname)) {
            model.delete(lname)
        } else {
            alert('Problem with  input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            student_id
            fname,
            lname,
            DOB,
            amount_due;

        student_id = $target
            .parent()
            .find('td.student_id')
            .text();

        fname = $target
            .parent()
            .find('td.fname')
            .text();

        lname = $target
            .parent()
            .find('td.lname')
            .text();

        DOB = $target
            .parent()
            .find('td.DOB')
            .text();

        amount_due = $target
            .parent()
            .find('td.amount_due')
            .text();

        view.update_editor(student_id,fname, lname, DOB, amount_due);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
