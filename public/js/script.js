// console.log('Script is linked');

// const { AlexaForBusiness } = require("aws-sdk");

//here we will have all our Vue code

(function () {
    //// COMPONENT START ///////
    Vue.component("modal-component", {
        template: "#commentModal",
        props: ["id"],
        mounted: function () {
            var self = this;
            // console.log("this in component", this);
            // console.log("postTitle: ", this.postTitle);
            // console.log("ID in mounted of components: ", this.id);
            // make a request to server sending the id
            // ask for all the information about the id
            axios
                .post("/image-post", { id: this.id })
                .then(function (response) {
                    // console.log("This is the response data: ", response.data);
                    self.image = response.data.shift();
                    self.comments = response.data[0];
                    // console.log("These are the comments: ", response.data[0]);
                })
                .catch(function (err) {
                    console.log("Error in POST /image-post: ", err);
                });
        },
        data: function () {
            return {
                image: {
                    url: "",
                    title: "",
                    description: "",
                    username: "",
                    optime: "",
                    commenter: "",
                    comment: "",
                    postertime: "",
                },
                comments: [],
                commenter: "",
                comment: "",
                created_at: "",
            };
        },
        methods: {
            closeModal: function () {
                this.$emit("close"); // is used in @close
            },
            postComment: function (e) {
                e.preventDefault();
                console.log("Someone wants to post a comment.");
                var self = this;
                var comment = {
                    commenter: this.commenter,
                    comment: this.comment,
                    image_id: this.id,
                };
                console.log("This is the comment: ", comment);
                axios.post("/post-comment", comment).then(function (response) {
                    console.log(
                        "This is the response data from POST /post-comment: ",
                        response.data
                    );
                    self.comments.unshift(response.data[0]);
                });
            },
        },
    });

    new Vue({
        // element -> el
        // which element in my html will have access
        // to my vue code
        el: "#main",
        // to data, I add any information that is
        // dynamic and might change that I will
        // render on screen
        // this data is 'reactive'
        data: {
            headline: "Latest Images",
            selectedImage: null,
            // selectedImage: location.hash.slice(1), //using the hash route to show img
            images: [],
            title: "",
            description: "",
            username: "random",
            file: null,
        },
        mounted: function () {
            // console.log("This is 'this' outside axios: ", this);
            // check for images in the db that
            // I want to eventually render
            var self = this;
            axios.get("/images").then(function (response) {
                // console.log("response from /images: ", response.data);
                self.images = response.data;
            });
        },
        methods: {
            closeMe: function () {
                console.log("Vue got the emitted message!");
                // close the modal
                this.selectedImage = null;
            },
            handleClick: function (e) {
                e.preventDefault();
                console.log(
                    "Someone clicked on the button, that's what in it: ",
                    this
                );
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                console.log("this.username: ", this.username);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        // console.log("Response from /upload: ",response.data);
                        self.images.unshift(response.data[0]);
                    })
                    .catch(function (err) {
                        console.log("Error in POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // console.log("handleChange is running");
                // console.log("File: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            getMore: function () {
                console.log("shown images", this.images);
                var lastId = { id: this.images[this.images.length - 1].id };
                var self = this;
                axios

                    .post("/show-more", lastId)
                    .then(function (response) {
                        self.images.push(...response.data);
                    })
                    .catch(function (err) {
                        console.log("Error in POST /show-more: ", err);
                    });
            },
        },
    });
})();
