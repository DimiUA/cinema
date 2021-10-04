<template>
  <Dialog
      :header="movieInfo.name"
      v-model:visible="isMovieModalVisible"
      :modal="true"
      :breakpoints="{'960px': '75vw', '640px': '100vw'}"
      :style="{width: '50vw'}"
      @hide="onModalHide"
      @show="onModalShow"
  >
    <Skeleton v-if="isLoadingMovieInfo" />
    <div v-else-if="isNoMovieInfo">
      <p>No Movie Info</p>
    </div>
    <div v-else class="p-fluid p-grid" >
      <div class="p-col-12 p-sm-12 p-md-6 p-lg-5 p-xl-4 film-additional-info" v-html="movieInfo.additional"></div>
      <div class="p-col-12 p-sm-12 p-md-6 p-lg-7 p-xl-8">
        <img class="movie-image" :src="movieInfo.image || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'" alt="">
        <div class="p-mt-3" v-html="movieInfo.description"></div>
      </div>
    </div>

    <template #footer>
      <Button label="Buy Ticket" icon="pi pi-shopping-cart" @click="isChooseSeatsModalVisible = true"></Button>

    </template>
  </Dialog>
  <ChooseSeatsModal v-model:isOpened="isChooseSeatsModalVisible" :movieId="movieId"/>
</template>

<script>
import Dialog from "primevue/dialog";
import Skeleton from 'primevue/skeleton';
import Button from "primevue/button";

import FetestService from '@/services/FetestService';
import ChooseSeatsModal from '@/components/choose-seats-modal'

export default {
  name: "movie-info-modal",

  components: {
    Dialog,
    Skeleton,
    Button,
    ChooseSeatsModal
  },

  props: {
    isOpened: { type: Boolean, default: false },
    movieId: { type: Number, default: null},
  },

  emits: ['update:isOpened', 'update:movieId'],

  watch: {
    isOpened(val){
      this.isMovieModalVisible = val
    }
  },

  data(){
    return {
      isMovieModalVisible: false,
      isLoadingMovieInfo: false,
      isNoMovieInfo: false,
      movieInfo: {},

      isChooseSeatsModalVisible: false
    }
  },
  fetestService: null,

  created() {
    this.fetestService = new FetestService();
  },

  methods: {
    onModalHide(){
      this.$emit('update:isOpened', false)
      this.$emit('update:movieId', null)
      this.isNoMovieInfo = false
    },
    async onModalShow(){
      if(!this.movieId){
        this.isNoMovieInfo = true
        return
      }

      this.isLoadingMovieInfo = true
      let response = await this.fetestService.getMovies({
        movie_id: this.movieId,
      })
      this.isLoadingMovieInfo = false
      if(!response || !response.length){
        this.isNoMovieInfo = true
        return
      }

      this.movieInfo = response[0]
      console.log(response)
    },
  }
}
</script>

<style lang="scss" scoped>
.movie-image{
  display: block;
  width: 100%;
  max-width: 233px;
  margin: auto;
}
::v-deep(.film-additional-info) {
  ul{
    margin: 0;
    padding: 0;
    list-style: none;

    li{
      p{
        margin: 0
      }
      .key{
        font-weight: 400;
        font-size: 12px;
        color: #b6b6b6;
      }
      .val{
        margin-bottom: 20px;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
}
</style>