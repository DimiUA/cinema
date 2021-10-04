<template>
  <Dialog :header="dialogTitle" v-model:visible="isDialogVisible" :style="{width: '350px'}" :modal="true">
    <p class="p-mb-0" v-html="dialogText"></p>

    <template #footer>
      <Button label="OK" icon="pi pi-check" autofocus class="p-m-0" @click="isDialogVisible=false"/>
    </template>
  </Dialog>

  <MegaMenu :model="menuItems" class="text-align-center"/>
  <router-view/>
</template>

<script>

import {mapGetters} from "vuex";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import MegaMenu from 'primevue/megamenu';

export default {
  components: {
    Dialog,
    Button,
    MegaMenu
  },

  data(){
    return{
      isDialogVisible: false,
      dialogTitle: '',
      dialogText: '',
      menuItems: [
        {
          label: 'All Movies',
          icon: 'pi pi-fw pi-video',
          to: '/genre/all'
        },
        {
          label: 'Sessions',
          icon: 'pi pi-fw pi-users',
          to: '/sessions/'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['error', 'alert']),
  },

  watch: {
    error(err){
      console.log(err)
      let defaultMsg = "An issue has been detected, please try again later or contact our support team"

      this.dialogTitle = "Error"

      //it's for debug cases, in production will be displayed relevant information for user
      this.dialogText = err.error_message || err.statusText || defaultMsg
      this.isDialogVisible = true
    },
    alert(param){

      this.dialogTitle = param.title || "Alert"
      this.dialogText = param.text || "An issue has been detected, please try again later or contact our support team"
      this.isDialogVisible = true
    }
  },
}
</script>

<style lang="scss" scoped>


</style>

