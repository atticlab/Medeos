<template>
  <div>
      <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-4"
      app
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-layout
            v-if="item.heading"
            :key="i"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-3"
          ></v-divider>
          <v-list-tile
            v-else
            :key="i"
            @click=""
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="amber" app fixed clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5"><router-link to="/" class="reset"><span class="font-weight-light">MED</span>EOS</router-link></span>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>exit_to_app</v-icon>
      </v-btn>

    </v-toolbar>
  </div>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      items: [
        { icon: 'settings', text: 'Dashboard' },
        { icon: 'account_box', text: 'Profile' },
        { icon: 'work', text: 'Reports' },
        { icon: 'calendar_today', text: 'Appointments' },
        { icon: 'chat_bubble', text: 'Reviews' },
        { icon: 'help', text: 'Help' },
        { divider: true },
        { icon: 'exit_to_app', text: 'Logout' },
      ]
    }),
    props: {
      source: String
    }
  }
</script>

<style type="text/css">
  .reset{
      text-decoration: none;
      color: initial;
  }
</style>