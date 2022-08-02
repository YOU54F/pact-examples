// import { pactWith } from "jest-pact";
const pactWith = require("jest-pact").pactWith;
// import { Matchers } from "@pact-foundation/pact";
const api = require("../../src/consumer").api;
// import api from "../../src/consumer";

pactWith(
  { consumer: "BearServiceClient", provider: "BearService" },
  (provider) => {
    let client;

    beforeEach(() => {
      client = api(provider.mockService.baseUrl);
    });

    describe("test bear endpoint", () => {
      const expectedResponse = {
        name: "Polar",
        colour: "White",
      };
      beforeEach(() =>
        provider.addInteraction({
          state: "Some bears exist",
          uponReceiving: "a request for the Polar bear species",
          willRespondWith: {
            status: 200,
            body: expectedResponse,
          },
          withRequest: {
            method: "GET",
            path: "/species/Polar",
          },
        })
      );

      it("returns a bear", async () => {
        return await client.getSpecies("Polar").then((resp) => {
          expect(resp).toEqual(expectedResponse);
        });
      });
    });
  }
);
