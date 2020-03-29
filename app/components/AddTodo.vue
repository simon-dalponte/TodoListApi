<template>
    <StackLayout>
        <Label text="Add new Todo"></Label>
        <TextField v-model="name" hint="Enter todo's name"></TextField>
        <Button text="Prendre une photo" @tap="takePicture" />
        <Button text="Choisir une photo" @tap="selectPicture" />
        <Button text="save" @tap="onSaveTap"></Button>
        <Image v-for="img in image" :src="img.img.src" width="75" height="75" />
    </StackLayout>
</template>

<script>
    import TodoList from "./TodoList"
    import * as camera from "nativescript-camera";
    import * as imagepicker from "nativescript-imagepicker";
    import { Image } from "tns-core-modules/ui/image";

    const dialogs = require("tns-core-modules/ui/dialogs");


    export default {
        props: ["id"],
        components:{
            TodoList
        },
        data(){
            return {
                name: "",
                image: [],
                url : null
            }
        },
        methods :{
            onSaveTap(){
                if(this.image.length === 1){
                    this.request()
                }else{
                    if(this.url){
                        let NewTodo = {
                            "content" : this.name,
                            "type" : "picture",
                            "media_url" : this.src
                        };
                        this.$modal.close(NewTodo)

                    }else{
                        let NewTodo = {
                            "content": this.name
                        };
                        this.$modal.close(NewTodo)

                    }

                }
            },
            selectPicture() {
                let context = imagepicker.create({
                    mode: 'single'
                });
                context.authorize()
                    .then(function() {
                        return context.present();
                    })
                    .then(selection => {
                        selection.forEach(selected => {
                            let img = new Image();
                            img.src = selected;
                            let obj = {img: img};
                            this.image.push(obj);
                            console.log(obj.img);
                            console.log(this.image.length);

                        });
                    }).catch(function (e) {
                    console.log('error in selectPicture', e);
                });
            },
            takePicture() {
                let obj = {};
                camera.requestPermissions()
                    .then(() => {
                        camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:false })
                            .then(imageAsset => {
                                let img = new Image();
                                img.src = imageAsset;
                                obj.img = img;
                                this.image.push(obj);
                            })
                            .catch(e => {
                                console.log('error:', e);
                            });
                    })
                    .catch(e => {
                        console.log('Error requesting permission :'+ e);
                    });
            },
            request(){

                const bghttp = require("nativescript-background-http");
                const session = bghttp.session("image-upload");

                console.log('1')
                const url = 'https://api.imgbb.com/1/upload';
                const api_key=  'bf1794aedb1cd3df011c27ee66f9c5e8';
                const request = {
                    url: url + "?key=" + api_key,
                    method: "POST",
                    header: {
                        "Content-Type": "application/octet-stream",
                    },
                    description: 'Uploading ' + this.getName(this.image[0].img.src.android)
                };
                const params = [
                    {name: 'image', filename: this.image[0].img.src.android,mimeType: 'image/jpeg'}
                ];
                console.log('2');

                const task = session.multipartUpload(params, request);
                task.on("progress", this.logEvent);
                task.on("error", this.logEvent);
                task.on("complete", this.logEvent);
                task.on("responded", this.respondedHandler);
            },

            logEvent(e) {
                console.log(e.eventName);
                if(e.eventName === 'error'){
                    dialogs.alert("Une erreur est survenue avec l'upload de la photo ")
                }
            },

            respondedHandler(e) {
                const result = JSON.parse(e.data);
                const uploaded_image = result.data;
                this.url = uploaded_image.url ;
                console.log('aaaaaaaaaa');
                console.log(this.url);
                if (this.url){
                    const newTodo = {
                        "content": this.name,
                        "media_url" : this.url,
                        "type": "picture"
                    };
                    this.$modal.close(newTodo);
                    dialogs.confirm('Votre photo a bien été upload dans le cloud :) ')

                }else{
                    const newTodo = {
                        "content": this.name
                    };
                    this.$modal.close(newTodo);
                    dialogs.confirm('Votre photo a bien été upload dans le cloud :) ')

                }
            },

            getName(path){
                const string = path.split('/');
                return string[string.length-1];
            },


        }
    };
</script>
