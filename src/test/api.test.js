const request = require("supertest");
const app = require("../../app");

//database conection
var config = require('../database/knexfile')['development']
const knex=require('knex')(config)
const { Model } = require('objection');
Model.knex(knex);

describe("Test the Doctors Endopoint", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/api/v1/doctor")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});