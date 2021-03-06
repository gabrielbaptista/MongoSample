var config = require('config.json');
var Q = require('q');
var mongo = require('mongoskin');
var connection = process.env.connectionString || config.connectionString;
var db = mongo.db(connection, { native_parser: true });
db.bind('people');

var service = {};
service.create = create;
service.getById = getById;
service.listPeople = listPeople;
service.update = update;
service.delete = _delete;

module.exports = service;


function create(pessoaParam) {
    var deferred = Q.defer();

    // validation
    db.people.findOne(
        { personName: pessoaParam.personName },
        function (err, person) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (person) {
                // username already exists
                deferred.reject('PersonName "' + pessoaParam.personName + '" is already taken');
            } else {
                createPerson();
            }
        });

    function createPerson() {
        db.people.insert(
            pessoaParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.people.findById(_id, function (err, person) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (person) {
            // return user (without hashed password)
            deferred.resolve(person);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function listPeople() {
    var deferred = Q.defer();

    db.people.find().toArray(function (err, people) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (people) {
            // return user (without hashed password)
            deferred.resolve(people);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function update(personParam) {
    var deferred = Q.defer();

    // validation
    db.people.findById(personParam._id, function (err, person) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (person) {
            updatePerson();
        }
    });

    function updatePerson() {
        // fields to update
        var set = {
            personName: personParam.personName,
            personDateOfBirth: personParam.personDateOfBirth,
            personPlaceOfBirth: personParam.personPlaceOfBirth,
        };

        db.people.update(
            { _id: mongo.helper.toObjectID(personParam._id) },
            { $set: set },
            function (err, doc) {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.people.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve();
        });

    return deferred.promise;
}

