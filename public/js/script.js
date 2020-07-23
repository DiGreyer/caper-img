// console.log('Script is linked');

const { AlexaForBusiness } = require("aws-sdk");

//here we will have all our Vue code

(function () {
    new Vue({
        el: '#main',   /// el represents HTML Element, in this case an element with id main, that has access to our Vue code
        //"data" is where Vue takes its data from, it updates automatically everytime the data has changed.. Rverything in "data" is "reactive" (lingo)
        data: {
            name: 'Caper',
            seen: 'true',
            cities: []

            //// we move the object in our index. js


            // {
            //     name: 'Berlin',
            //     country: "DE"
            // },
            // {
            //     name: 'Varna',
            //     country: "Bulgaria"
            // },
            // {
            //     name: "Halifax",
            //     country: 'Canada'
            // }


        }, //data ends

        // mounted is a lifcycle method that runs when the Vue instance renders
        // we want to check for our images in this method via axios.  Axios is promise based
        mounted: function () {
            // console.log("my  Vue has mounted!")

            console.log('this outside axios is :', this);
            var self = this;

            axios.get('/cities').then(function (response) {
                console.log('this inside axios is :', self);
                console.log('response from /cities', response.data);
                self.cities = respose.data;

                /// axios will ALWAYS give a responce with data property!!! data is where all the requested information is
            })

        },

        methods: {
            // WE cannot use a ES6 syntax (arrow fucntion, let, const) in Vue, because we dotn use a ..... and arrow fucntion might now work on browser. 

            myFunction: function () {
                console.log("myFunction is running!!!")
            }
        }
    });

})();