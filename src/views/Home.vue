<template>
  <div class="home">

    <el-container direction="vertical">

      <Header></Header>
      <el-main>
        <h4>
          Movies Data Search
        </h4>

        <el-row>
          <el-col :xs="{span: 24}" :sm="{span: 16, offset: 4}" :md="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :xl="{span: 16, offset: 4}">
            <el-input placeholder="Please type to Search a Movie or TV show" v-model="term" @change="getMovies">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-button type="danger" plain slot="append" @click="getMovies">Search</el-button>
            </el-input>
          </el-col>

          <el-col :xs="{span: 24}" :sm="{span: 16, offset: 4}" :md="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :xl="{span: 16, offset: 4}">
            <el-alert
              v-if="error"
              :title="error"
              type="error">
            </el-alert>
          </el-col>

        </el-row>
        <el-row v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-row>
            <el-col>

              <h5 v-if="total > 0">
                Total results {{total}}
              </h5>

              <el-pagination
                v-if="total > 0"
                :pager-count="pagerCount"
                :current-page="currentPage"
                hide-on-single-page
                layout="prev, pager, next"
                @current-change="queryCurrentPage"
                :total="total">
              </el-pagination>
            </el-col>
          </el-row>

          <el-row :gutter="20">

            <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3"
                    v-for="(movie, index) in movies" :key="`${movie.imdbID}${index}`">
              <Movie :movieData="movie"></Movie>
            </el-col>

          </el-row>

          <el-row>
            <el-col>
              <el-pagination
                v-if="total > 0"
                :pager-count="pagerCount"
                :current-page="currentPage"
                hide-on-single-page
                layout="prev, pager, next"
                @current-change="queryCurrentPage"
                :total="total">
              </el-pagination>
            </el-col>
          </el-row>
        </el-row>
      </el-main>

    </el-container>

  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Movie from '@/components/Movie.vue'
import { SEARCH_MOVIES_BY_TERM, SEARCH_MOVIES_BY_PAGE } from '@/store/actions-types'

export default {
  name: 'Home',
  components: {
    Header,
    Movie
  },
  data () {
    return {
      term: this.$store.state.searchTerm,
      pagerCount: 7
    }
  },
  computed: {
    total () {
      return this.$store.state.total
    },
    error () {
      return this.$store.state.error
    },
    movies () {
      return this.$store.state.searchResult
    },
    currentPage () {
      return this.$store.state.currentPage
    },
    loading () {
      return this.$store.state.loading
    }
  },
  methods: {
    getMovies () {
      const searchTerm = this.term.trim()
      if (searchTerm.length > 0) {
        this.$store.dispatch(SEARCH_MOVIES_BY_TERM, { term: searchTerm })
      }
    },
    queryCurrentPage (page) {
      const searchTerm = this.term.trim()
      if (searchTerm.length > 0) {
        this.$store.dispatch(SEARCH_MOVIES_BY_PAGE, { term: searchTerm, page: page })
      } else {
        const searchTerm = this.$store.state.searchTerm
        this.$store.dispatch(SEARCH_MOVIES_BY_PAGE, { term: searchTerm, page: page })
      }
    }
  }
}
</script>
<style lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
  .el-alert{
    margin-top: 20px;
  }
  .el-pagination__total{
    color: white;
    font-size: 14px;
  }
  .el-pagination .btn-prev, .el-pagination .btn-next, .el-pager li, .el-pagination button:disabled {
    background: none;
    color: white;
  }
  .el-pager li.active, .el-pager li:hover {
    color: #e64749;
  }
  #result-stats {
    position: absolute;
    top: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-transition: all 220ms ease-in-out;
    color: #70757a;
    height: 50px;
    text-align: center;
    width: 100%;
  }

</style>
