
# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d"))


# Data to serve with our API
PEOPLE = {
    "Kumar": {
        "student_id": '100',
        "fname": "Suresh",
        "lname": "Kumar",
        "DOB": "30-12-1996",
        "amount_due":"200",
    },
    "Parker": {
        "student_id": '101',
        "fname": "Peter",
        "lname": "Parker",
        "DOB": "20-02-1996",
        "amount_due":"300",
    },
    "Rao": {
        "student_id": '101',
        "fname": "Babu",
        "lname": "Rao",
        "DOB": "20-02-1996",
        "amount_due":"300",
        },
    "Sharma": {
        "student_id": '102',
        "fname": "Ramesh",
        "lname": "Sharma",
        "DOB": "10-05-1997",
        "amount_due":"400",
    },
}


def read_all():
    """
    This function responds to a request for /api/people
    with the complete lists of people
    :return:        json string of list of people
    """
    # Create the list of people from our data
    return [PEOPLE[key] for key in sorted(PEOPLE.keys())]


def read_one(lname):
    """
    This function responds to a request for /api/people/{lname}
    with one matching person from people
    :param lname:   last name of person to find
    :return:        person matching last name
    """
    # Does the person exist in people?
    if lname in PEOPLE:
        person = PEOPLE.get(lname)

    # otherwise, nope, not found
    else:
        abort(
            404, "Person with last name {lname} not found".format(lname=lname)
        )

    return person


def create(person):
    """
    This function creates a new person in the people structure
    based on the passed in person data
    :param person:  person to create in people structure
    :return:        201 on success, 406 on person exists
    """
    student_id = person.get("student_id", None)
    lname = person.get("lname", None)
    fname = person.get("fname", None)
    DOB = person.get("DOB", None)
    amount_due = person.get("amount_due", None)

    # Does the person exist already?
    if lname not in PEOPLE and lname is not None:
        PEOPLE[lname] = {
            "student_id":student_id,
            "lname": lname,
            "fname": fname,
            "DOB": DOB,
            "amount_due" : amount_due,
        }
        return PEOPLE[lname], 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "Peron with last name {lname} already exists".format(lname=lname),
        )


def update(lname, person):
    """
    This function updates an existing person in the people structure
    :param lname:   last name of person to update in the people structure
    :param person:  person to update
    :return:        updated person structure
    """
    # Does the person exist in people?
    if lname in PEOPLE:
        PEOPLE[lname]["student_id"] = person.get("student_id")
        PEOPLE[lname]["fname"] = person.get("fname")
        PEOPLE[lname]["DOB"] = person.get("DOB")
        PEOPLE[lname]["amount_due"] = person.get("amount_due")

        return PEOPLE[lname]

    # otherwise, nope, that's an error
    else:
        abort(
            404, "Person with last name {lname} not found".format(lname=lname)
        )


def delete(lname):
    """
    This function deletes a person from the people structure
    :param lname:   last name of person to delete
    :return:        200 on successful delete, 404 if not found
    """
    # Does the person to delete exist?
    if lname in PEOPLE:
        del PEOPLE[lname]
        return make_response(
            "{lname} successfully deleted".format(lname=lname), 200
        )

    # Otherwise, nope, person to delete not found
    else:
        abort(
            404, "Person with last name {lname} not found".format(lname=lname)
        )
