<template>
  <div class="home">
    <ProgressBar v-if="isLoadingMovies" mode="indeterminate" class="custom-progressbar"></ProgressBar>

    <DataView :value="filmsList" :layout="layout" :paginator="true" :rows="maxRecordsOnPage" >
      <template #header>
        <form class="p-fluid p-grid" @submit.prevent="getMovies">
          <div class="p-col-12 p-sm-12 p-md-3 p-lg-3 p-xl-3">
            <InputText v-model.trim="filterName" placeholder="Search..." />
          </div>
          <div class="p-col-12 p-sm-12 p-md-3 p-lg-3 p-xl-3" v-tooltip.bottom="'Select Genre'">
            <Dropdown v-model="filterGenre" :options="genreOptions" optionLabel="label" placeholder="Genre" />
          </div>
          <div class="p-col-12 p-md-3 p-lg-2 margin-left-auto">
            <Button type="submit" label="Show" icon="pi pi-search" iconPos="left"/>
          </div>
        </form>
      </template>

      <template #grid="slotProps">
        <div class="p-col-12 p-sm-6 p-md-4 p-p-2">
          <div class="product-grid-item card">
            <div class="product-grid-item-top">
              <div>
                <a class="product-category" :href="$router.resolve({ name: 'Genre', params: { genre: genreTextEnum[slotProps.data.genre] }}).href">
                  <i class="pi pi-tag product-category-icon"></i>
                  <span class="product-category-text">{{genreTextEnum[slotProps.data.genre] || 'none'}}</span>
                </a>
              </div>
            </div>
            <div class="p-fluid p-grid product-grid-item-content cursor-pointer" @click="openMovieInfo(slotProps.data.id)">
              <div class="p-col-12 p-sm-12 p-md-6">
                <img class="product-image" :src="slotProps.data.image || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'" :alt="slotProps.data.name"  />
              </div>
              <div class="p-col-12 p-sm-12 p-md-6 ">
                <div class="product-name" >{{stripHtmlTags(slotProps.data.name)}}</div>
                <div class="product-description" >{{stripHtmlTags(slotProps.data.description)}}</div>
              </div>
            </div>
            <div class="product-grid-item-bottom">
              <Button label="Buy Ticket" icon="pi pi-shopping-cart" class="width-100" @click="openChooseSeats(slotProps.data.id)"></Button>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <MovieInfoModal v-model:isOpened="isMovieModalVisible" v-model:movieId="movieId"/>
    <ChooseSeatsModal v-model:isOpened="isChooseSeatsModalVisible" :movieId="movieId"/>
  </div>
</template>

<script>


import Button from "primevue/button";
import DataView from "primevue/dataview";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Tooltip from 'primevue/tooltip';
import ProgressBar from "primevue/progressbar";

import FetestService from '@/services/FetestService';

import MovieInfoModal from '@/components/movie-info-modal'
import ChooseSeatsModal from '@/components/choose-seats-modal'

import {stripHtmlTags, genreEnum} from '@/js/helpers'

export default {
  name: 'Home',
  components: {
    Button,
    DataView,
    Dropdown,
    InputText,
    ProgressBar,

    MovieInfoModal,
    ChooseSeatsModal
  },

  directives: {
    'tooltip': Tooltip
  },


  data() {
    return {
      isLoadingMovies: false,
      isMovieModalVisible: false,
      filmsList: null,
      layout: 'grid',
      filterGenre: null,
      filterName: '',
      maxRecordsOnPage: 9,

      genreOptions: [
        {label: 'All', value: null},
        {label: 'Action', value: 0},
        {label: 'Adventures', value: 1},
        {label: 'Comedy', value: 2},
        {label: 'Drama', value: 3},
        {label: 'Horror', value: 4},
        {label: 'Westerns', value: 5},
      ],
      genreTextEnum: ['Action','Adventures','Comedy','Drama','Horror','Westerns'],
      movieId: null,

      isChooseSeatsModalVisible: false
    }
  },
  fetestService: null,

  created() {
    this.fetestService = new FetestService();
  },
  mounted() {
    if(this.$route.params.genre){
      this.filterGenre = this.genreOptions.find(itm => itm.value === genreEnum[this.$route.params.genre.toUpperCase()])
    }
    this.getMovies()
  },
  methods: {
    async getMovies(){
      this.isLoadingMovies = true

      //TODO found bug on api, when send genre as 0(ACTION) it will return list with all genres
      let response = await this.fetestService.getMovies({
        name: this.filterName || '',
        genres: this.filterGenre?.value
      })

      //we will load all genres if there ar no such genre
      this.$router.replace({ name: "Genre", params: {genre: this.filterGenre?.label.toLowerCase() || 'all'} })


      this.isLoadingMovies = false
      if(!response) return
      this.filmsList = response
      console.log(response)
    },
    stripHtmlTags(str){
      return stripHtmlTags(str)
    },
    async openMovieInfo(movieId){
      if(!movieId) return
      this.isMovieModalVisible = true
      this.movieId = movieId
    },
    openChooseSeats(movieId){
      if(!movieId) return
      this.isChooseSeatsModalVisible = true
      this.movieId = movieId
    }
  }
}
</script>


<style lang="scss" scoped>

</style>