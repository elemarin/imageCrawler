const fs = require('fs');

describe('Check if all images return 200 and have browser cache header', function () {
    it('Gets image from URL', function () {

        cy.task('readDirectory', "imageURLs/").then(files => {
            files.forEach(file => {

                cy.readFile(`imageURLs/${file}`).then((str) => {
                    str.forEach(function (url) {
                        cy.request({ 
                            url: url,
                            failOnStatusCode: false,
                        }).then( response => {
                            expect(response.headers).to.have.property('cache-control');
                            expect(response.status).to.eq(200);
        
                            cy.log('REDIRECTS: ', response.redirects);
                        });
                    cy.log('------------------------------------------------------------------------------------------');
                    });
                })

            });
        })

    })
})