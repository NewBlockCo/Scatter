<template>
    <section class="networks">

        <nav-actions :actions="[
            {event:'create', icon:'plus-square-o'}
        ]" v-on:create="createNetwork"></nav-actions>

        <search v-on:changed="changed => bind(changed, 'searchText')"></search>

        <section class="p20 scroller with-search">
            <section v-for="network in filterBySearch()" class="panel-box">

                <!-- Header -->
                <section class="panel">
                    <figure class="header big"><i class="fa fa-globe"></i>{{network.host}}</figure>
                    <figure class="header small margin"><i class="fa fa-plug"></i>{{network.port}}</figure>
                </section>

                <!-- Actions -->
                <section class="panel">
                    <section class="actions">
                        <!--<figure v-on:click="goToNetwork(network)" class="action"><i class="fa fa-pencil-square-o"></i></figure>-->
                        <figure class="action red right" v-on:click="deleteNetwork(network)"><i class="fa fa-minus-square"></i></figure>
                    </section>
                </section>

            </section>
        </section>
    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import Scatter from '../models/Scatter'
    import AlertMsg from '../models/alerts/AlertMsg'

    export default {
        data(){ return {
            searchText:''
        }},
        computed: {
            ...mapState([
                'scatter'
            ]),
            ...mapGetters([
                'networks'
            ])
        },
        methods: {
            bind(changed, original) { this[original] = changed },
            goToNetwork(network){ this.$router.push({ name:RouteNames.NETWORK, query: { networkunique: network.unique() } }) },
            createNetwork(){ this.$router.push({ name:RouteNames.NETWORK, query: { networkunique: '' } }) },
            filterBySearch(){ return this.networks.filter(x => JSON.stringify(x).indexOf(this.searchText) > -1) },
            deleteNetwork(network){
                if(network.isEndorsedNetwork()){
                    this[Actions.PUSH_ALERT](AlertMsg.RemovingEndorsedNetwork());
                    return false;
                }

                this[Actions.PUSH_ALERT](AlertMsg.AreYouSure('Deleting Network', ['Scatter', 'Networks'],
                    'You are about to delete a Network. You will not be able ' +
                    'to create new accounts on this Network once you delete it, ' +
                    'but nothing is stopping you from re-adding it. Any accounts ' +
                    'already using this Network will not be modified or removed.')
                ).then(res => {
                    if(!res || !res.hasOwnProperty('accepted')) return false;
                    const scatter = this.scatter.clone();
                    scatter.settings.networks = scatter.settings.networks.filter(x => x.unique() !== network.unique());
                    this[Actions.UPDATE_STORED_SCATTER](scatter);
                })
            },
            ...mapActions([
                Actions.UPDATE_STORED_SCATTER,
                Actions.PUSH_ALERT,
            ])
        }
    }
</script>

<style lang="scss">
    .networks {

    }
</style>