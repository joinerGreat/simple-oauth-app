'use strict'

const { as } = require('@cuties/cutie')
const { If, Else } = require('@cuties/if-else')
const { ResponseWithStatusCode, ResponseWithHeader, ResponseWithHeaders, EndedResponse } = require('@cuties/http')
const { Endpoint, RequestBody } = require('@cuties/rest')
const { ParsedJSON, StringifiedJSON } = require('@cuties/json')
const { StringFromBuffer } = require('@cuties/buffer')
const GeneratedJWTByUser = require('./../async/GeneratedJWTByUser')
const CreatedUser = require('./../async/CreatedUser')
const ExpirationTime = require('./../auth/ExpirationTime')
const Secret = require('./../auth/Secret')
const ObjectID = require('mongodb').ObjectID
const Db = require('./../mongo/Db')
const Collection = require('./../mongo/Collection')
const UserQueryByEmailAndPassword = require('./../async/UserQueryByEmailAndPassword')
const DoesDocumentExist = require('./../mongo/DoesDocumentExist')
const InsertedDocument = require('./../mongo/InsertedDocument')

class SignInEndpoint extends Endpoint {
  constructor (regexpUrl, type, mongoClient) {
    super(regexpUrl, type)
    this.mongoClient = mongoClient
  }

  body (request, response) {
    return new CreatedUser(
      null,
      new ParsedJSON(
        new StringFromBuffer(
          new RequestBody(
            request
          )
        )
      )
    ).as('user').after(
      new If (
        new DoesDocumentExist(
          new Collection(
            new Db(
              this.mongoClient, 'db'
            ),
            'users'
          ).as('usersCollection'),
          new UserQueryByEmailAndPassword(
            as('user')
          )
        ),
        new EndedResponse(
          new ResponseWithStatusCode(
            new ResponseWithHeader(
              response, 'Content-Type', 'application/json'
            ), 200
          ),
          new StringifiedJSON(
            new GeneratedJWTByUser(
              as('user'),
              new ExpirationTime(15),
              new Secret()
            )
          )
        ),
        new Else(
          new EndedResponse(
            new ResponseWithStatusCode(
              new ResponseWithHeader(
                response, 'Content-Type', 'application/json'
              ), 404
            ), new StringifiedJSON({
              errMessage: 'User not found'
            })
          )
        )
      )
    )
  }
}

module.exports = SignInEndpoint
