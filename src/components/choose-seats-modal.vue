<template>
  <Dialog
      :header="movieInfo.name"
      v-model:visible="isMovieModalVisible"
      :modal="true"
      :style="{width: '100vw'}"
      class="p-dialog-maximized"
      @hide="onModalHide"
      @show="onModalShow"
  >
    <Skeleton v-if="isLoading" />
    <form v-else @submit.prevent="onSubmit(!v$.$invalid)">
      <input type="submit" class="p-d-none">
      <h4 class="book-description">Please choose Day, Time and available Seat to book ticket</h4>
      <div class="p-fluid p-grid">
        <div class="p-col-fixed width-150">
          <img class="movie-image" :src="movieInfo.image || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'" alt="">
        </div>
        <div class="p-col">
          <div class="p-fluid p-grid">
            <div class="p-col-12 p-sm-6 p-md-4 p-lg-3">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-calendar"></i>
                </span>
                <Dropdown v-model="v$.activeDay.$model" :options="sessionDaysOptions" placeholder="Session Day" :class="{'p-invalid':v$.activeDay.$invalid && isSubmitted}" />
              </div>
              <small v-if="(v$.activeDay.$invalid && isSubmitted) || v$.activeDay.$pending.$response" class="p-error">{{v$.activeDay.required.$message.replace('Value', 'Session Day')}}</small>
            </div>

            <div class="p-col-12 p-sm-6 p-md-4 p-lg-3">
              <div class="p-inputgroup ">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-clock"></i>
                </span>
                <Dropdown v-model="v$.activeTime.$model" :options="sessionTimeOptions" placeholder="Session Time" :class="{'p-invalid':v$.activeTime.$invalid && isSubmitted}"/>
              </div>
              <small v-if="(v$.activeTime.$invalid && isSubmitted) || v$.activeDay.$pending.$response" class="p-error">{{v$.activeTime.required.$message.replace('Value', 'Session Time')}}</small>
            </div>
          </div>
        </div>
      </div>
      <div class="cinema p-mt-3 overflow-x-auto">
        <!--<div class="screen">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 806 21" fill="#061420">
            <path d="M3.2,20l-2,0.2l-0.3-4l2-0.2C136.2,5.3,269.6,0,403,0s266.8,5.3,400.2,16l2,0.2l-0.3,4l-2-0.2 C669.5,9.3,536.3,4,403,4S136.4,9.3,3.2,20z"></path>
          </svg>
          <h5 class="p-mt-0 text-align-center">SCREEN</h5>
        </div>-->
        <div class="seats p-mt-5 p-d-flex p-flex-column">
          <div
              v-for="(rowContainer, key) in seatsData"
              :key="`key-seats-row-${key}`"
              class="p-d-flex p-m-auto"
          >
            <div
                v-for="seatContainer in rowContainer[1]"
                :key="`key-seats-row-${rowContainer[0].row}-${seatContainer.seat}`"
                class="seat-position"
                v-tooltip.bottom="`${rowContainer[0].row} Row, ${seatContainer.seat} Seat`"
                :class="{
                  disabled: !seatContainer.is_free,
                  selected: selectedSeat === `${rowContainer[0].row};${seatContainer.seat}`
                }"
                @click="seatContainer.is_free ? selectedSeat = `${rowContainer[0].row};${seatContainer.seat}` : ''"
            ></div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button label="Confirm" icon="pi pi-shopping-cart" @click="onSubmit(!v$.$invalid)"></Button>

    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Skeleton from 'primevue/skeleton';
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Tooltip from 'primevue/tooltip';

import FetestService from '@/services/FetestService';
import {isObjEmpty} from "@/js/helpers";

import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";


export default {
  setup: () => ({ v$: useVuelidate() }),
  name: "choose-seats-modal",

  components: {
    Dialog,
    Skeleton,
    Button,
    Dropdown,
  },

  directives: {
    'tooltip': Tooltip
  },

  props: {
    isOpened: { type: Boolean, default: false },
    movieId: { type: Number, default: null },
    day: { type: String, default: null },
    time: { type: String, default: null },
  },

  emits: ['update:isOpened'],

  watch: {
    isOpened(val){
      this.isMovieModalVisible = val
    },
    movieId(){
      this.getSeatsData()
    },
    activeDay(){
      this.getSeatsData()
    },
    activeTime(){
      this.getSeatsData()
    }

  },

  data(){
    return {
      isMovieModalVisible: false,
      isLoading: false,
      movieInfo: {},
      allSessions: null,
      sessionDaysOptions: [],
      seatsData: [],
      //sessionTimeOptions: [],
      activeDay: '',
      activeTime: '',
      selectedSeat: null,
      isSubmitted: false
    }
  },
  fetestService: null,
  validations() {
    return {
      activeDay: {
        required,
      },
      activeTime: {
        required,
      },
    }
  },

  created() {
    this.fetestService = new FetestService();
  },

  computed: {
    sessionTimeOptions(){
      if(!this.movieId || !this.activeDay) return []
      return this.allSessions[''+this.movieId].find(itm => itm.showdate === this.activeDay).daytime.split(';')
    },
  },

  methods: {
    onModalHide(){
      this.$emit('update:isOpened', false)
      this.activeDay = null
      this.activeTime = null
      this.seatsData = null
      this.selectedSeat = null
      this.isSubmitted = false

    },
    async onModalShow(){
      if(!this.movieId) return

      this.isLoading = true
      let [movieResponse, allSessions] = await Promise.all([this.fetestService.getMovies({ movie_id: this.movieId }), this.fetestService.getSessions()]);
      this.isLoading = false
      if(isObjEmpty(movieResponse) || isObjEmpty(allSessions)) return

      this.movieInfo = movieResponse[0]
      this.allSessions = allSessions

      let sessionDaysSet = new Set();
      for (const {1: movieSchedule} of Object.entries(allSessions)) {
        movieSchedule.forEach(itm => sessionDaysSet.add(itm.showdate))
      }
      if(sessionDaysSet.size === 0) return
      this.sessionDaysOptions = [...sessionDaysSet];
      this.activeDay = this.day || this.sessionDaysOptions[0]
      if(this.time){
        this.activeTime = this.time
      }

    },
    async getSeatsData(){
      if(!this.movieId || !this.activeDay || !this.activeTime) return []

      let response = await this.fetestService.getSeats({
        movie_id: this.movieId,
        daytime: this.activeDay,
        showdate: this.activeTime
      })
      if(isObjEmpty(response)) return
      this.seatsData = response

    },
    async onSubmit(isFormValid){
      this.isSubmitted = true;

      if (!isFormValid) {
        return;
      }

      if(!this.selectedSeat){
        this.$store.commit('SET_ALERT', {text: 'Select available Seat please'})
        return;
      }
      const seatArr = this.selectedSeat.split(';')
      let response = await this.fetestService.bookSeat({
        movie_id: this.movieId,
        daytime: this.activeTime,
        showdate: this.activeDay,
        row: parseInt(seatArr[0]),
        seat: parseInt(seatArr[1]),
      })
      if(isObjEmpty(response)) return
      this.$store.commit('SET_ALERT', {
        title: 'Success',
        text: `You purchased ticket: ${response.ticketkey}`
        //text: `You purchased ticket: `
      })
      this.$emit('update:isOpened', false)

      //TODO always receiving error "404MovieID" not found
      //have tried with GET and POST HTTP methods
      //sent data as query and post params
      //also tried to use different movie id name like "movie_id" / "movieid" / "MovieID" etc
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "../css/variables.scss";

  .book-description{
    color: red;
    text-align: center;
  }
  .movie-image{
    display: block;
    width: 100%;
    max-width: 233px;
    margin: auto;
  }

  .screen{
    width: 10rem;
    margin: 0 auto;
  }
  .seat-position{
    margin: 0.25rem;
    height: 28px;
    width: 20px;
    /*min-height: 1.75rem;
    min-width: 1.25rem;*/
    border-radius: 3px;
    cursor: pointer;
    transition: all .3s;
    border: 1px solid #ced4da;
    background: #fff;
    -webkit-flex-basis: 20px;
    flex-basis: 20px;
    &.disabled{
      cursor: initial;
      opacity: .5;
    }
    &.selected{
      border-color: $primaryColor;
      background-color: $primaryColor;
    }
    &:not(.disabled):hover {
      border-color: $primaryColor;
    }

  }

</style>