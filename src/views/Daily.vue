<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><i class="mdi mdi-format-list-bulleted menu-icon"></i></p>
              <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalDaily v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Add Activity</b-button>
              </p>
              <div class="table-responsive">

                <b-table striped hover :items="daily" :fields="fields">
                  <template v-slot:cell(daily)="data">
                    <h5><b-badge variant="warning">{{ data.item.daily }}</b-badge></h5>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal 
      id="modalDaily"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form Input DailyScrum
      </template>
        <form ref="form">
            <div class="form-group">
              <label for="tanggal" class="col-form-label">Tanggal</label>
              <b-form-input type="date" v-model="tanggal"></b-form-input>
          </div>
          <div class="form-group">
            <label for="id_users" class="col-form-label">Team</label>
            <select class="form-control" name="team" id="team" v-model="team">
              <option value="DDS" checked>DDS</option>
              <option value="BEON">BEON</option>
              <option value="DOT">DOT</option>
              <option value="node1">Node 1</option>
              <option value="node2">Node 2</option>
              <option value="react1">React 1</option>
              <option value="react2">React2</option>
              <option value="laravel">Laravel</option>
              <option value="laravel_vue">Laravel dan Vue</option>
              <option value="android">Android</option>
            </select>
          </div>
          <div class="form-group">
            <label for="activity_yesterday" class="col-form-label">Yesterday's activity</label>
            <b-form-input type="text" v-model="activity_yesterday" placeholder="Yesterday's activity"></b-form-input>
          </div>
          <div class="form-group">
            <label for="activity_today" class="col-form-label">Today's activity</label>
            <b-form-input type="text" v-model="activity_today" placeholder="Today's activity"></b-form-input>
          </div>
          <div class="form-group">
            <label for="problem_yesterday" class="col-form-label">Problem's activity</label>
            <b-form-input type="text" v-model="problem_yesterday" placeholder="Yesterday's problem"></b-form-input>
          </div>
          <div class="form-group">
            <label for="solution" class="col-form-label">Solution</label>
            <b-form-input type="text" v-model="solution" placeholder="Solution"></b-form-input>
          </div>
        </form>
    </b-modal>

  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id: "",
      id_user: "this.id_users",
      team: "",
      activity_yesterday: "",
      activity_today: "",
      problem_yesterday: "",
      solution: "",
      tanggal: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      fields: ["tanggal", "yesterday", "today", "problem", "solution", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/daily/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.status == 1){
          this.$bvToast.hide("loadingToast");
          this.daily = response.data.daily;
          this.rows = response.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data daily scrum."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    Add : function(){
      this.action = "insert";
      this.team = "";
      this.activity_yesterday = "";
      this.activity_today = ""; 
      this.problem_yesterday = ""; 
      this.solution = ""; 
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("team", this.team);
        form.append("activity_yesterday", this.activity_yesterday);
        form.append("activity_today", this.activity_today);
        form.append("problem_yesterday", this.problem_yesterday);
        form.append("solution", this.solution);

        this.axios.post("/daily", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        let form = {
          team: this.team,
          activity_yesterday: this.activity_yesterday,
          activity_today: this.activity_today,
          problem_yesterday: this.problem_yesterday,
          solution: this.solution,
        }
        this.axios.put("/daily/" + this.id, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/daily/" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>
