<template>
  <div>
    <ProgressBar v-if="isLoading" mode="indeterminate" class="custom-progressbar"></ProgressBar>

    <DataView :value="filmsList" :layout="layout" :paginator="true" :rows="maxRecordsOnPage" >

      <template #header>
        <SelectButton v-model="activeDay" :options="sessionDays" class="text-align-center"/>
        <Divider align="center" class="header-divider">
          <div class="p-d-inline-flex p-ai-center">
            <i class="pi pi-check-circle p-mr-2"></i>
            Please, click on daytime to choose seats
          </div>
        </Divider>
      </template>

      <template #grid="slotProps">

        <div class="p-col-12 p-sm-6 p-md-4 p-p-2">
          <div class="product-grid-item card">
            <div class="p-fluid p-grid product-grid-item-content" >
              <div class="p-col-12 p-sm-12 p-md-6">
                <img class="product-image cursor-pointer" :src="slotProps.data.image || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'" :alt="slotProps.data.name" @click="openMovieInfo(slotProps.data.id)" />
              </div>
              <div class="p-col-12 p-sm-12 p-md-6 ">
                <div class="product-name cursor-pointer" @click="openMovieInfo(slotProps.data.id)">{{stripHtmlTags(slotProps.data.name)}}</div>
                <div class="p-fluid p-grid p-mt-2 p-ac-end">
                  <div
                      v-for="daytime in getDaytime(slotProps.data.id)"
                      class="p-col cursor-pointer session-daytime"
                      :key="`key-${slotProps.data.id}-${daytime}`"
                      @click="openChooseSeats(slotProps.data.id, daytime)"
                  >
                    {{daytime}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <MovieInfoModal v-model:isOpened="isMovieModalVisible" :movieId="movieId"/>
    <ChooseSeatsModal v-model:isOpened="isChooseSeatsModalVisible" :movieId="movieId" :day="activeDay" :time="selectedTime"/>
  </div>
</template>

<script>

import DataView from "primevue/dataview";
import ProgressBar from "primevue/progressbar";
import SelectButton from 'primevue/selectbutton';
import Divider from 'primevue/divider';

import FetestService from '@/services/FetestService';
import {stripHtmlTags, isObjEmpty} from "@/js/helpers";

import MovieInfoModal from '@/components/movie-info-modal'
import ChooseSeatsModal from '@/components/choose-seats-modal'

export default {
  name: "Sessions",
  components: {
    DataView,
    ProgressBar,
    SelectButton,
    Divider,

    MovieInfoModal,
    ChooseSeatsModal,
  },

  data() {
    return {
      isLoading: false,
      //filmsList: null,
      layout: 'grid',
      allMovies: null,
      allSessions: null,
      sessionDays: [],
      sessionMovieIds: [],
      activeDay: null,
      maxRecordsOnPage: 9,

      isChooseSeatsModalVisible: false,
      movieId: null,
      selectedTime: null,

      isMovieModalVisible: false
    }
  },
  fetestService: null,

  created() {
    this.fetestService = new FetestService();
  },

  mounted() {
    this.getInitialData()
  },
  computed: {
    filmsList(){
      if(!this.allMovies?.length) return []
      return this.allMovies.filter( itm => this.sessionMovieIds.includes(itm.id))
    }
  },
  methods: {
    async getInitialData(){
      this.isLoading = true
      let [allMovies, allSessions] = await Promise.all([this.fetestService.getMovies(), this.fetestService.getSessions()]);
      this.isLoading = false

      if(isObjEmpty(allMovies) || isObjEmpty(allSessions)) return
      this.allMovies = allMovies
      this.allSessions = allSessions

      let sessionDaysSet = new Set();
      let sessionFilmsIdSet = new Set();
      for (const [movieId, movieSchedule] of Object.entries(allSessions)) {
        movieSchedule.forEach(itm => sessionDaysSet.add(itm.showdate))
        sessionFilmsIdSet.add(+movieId)
      }
      if(sessionDaysSet.size === 0) return
      this.sessionDays = [...sessionDaysSet];
      this.sessionMovieIds = [...sessionFilmsIdSet];
      this.activeDay = this.sessionDays[0]

    },
    stripHtmlTags(str){
      return stripHtmlTags(str)
    },
    getDaytime(movieId){
      return this.allSessions[''+movieId].find(itm => itm.showdate === this.activeDay).daytime.split(';')
    },
    async openMovieInfo(movieId){
      if(!movieId) return
      this.isMovieModalVisible = true
      this.movieId = movieId
    },
    openChooseSeats(movieId, time){
      this.selectedTime = time
      this.movieId = movieId
      this.isChooseSeatsModalVisible = true
    }
  }
}
</script>

<style scoped>

</style>