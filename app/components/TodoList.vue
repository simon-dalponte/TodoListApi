<template>
    <Stacklayout>
        <ListView for="todo in todos" @item-tap="onItemTap">
            <v-template>
                <todo :todo="todo"></todo>
            </v-template>
        </ListView>
    </Stacklayout>
</template>

<script>
    import Todo from "./Todo"
    export default {
        props: ["todos"],
        components: {
            Todo,
        },
        methods: {
            onItemTap(args){
                console.log("coucou hibou")
            }
        }
    };
</script>

<style scoped="scss">
    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
    .zinzin{
        height: 100%;
    }
</style>
