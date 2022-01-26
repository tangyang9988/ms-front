<template>
  <div class="loam_company_rank">
    <div id="header">企业排名</div>

    <table class="company_rank" id="rankTable">
      <tr class="table_head">
        <td>最优排名</td>
        <td>最差排名</td>
      </tr>
      <tr class="table_body" v-for="(item, index) in tableData" :key="index">
        <td>{{item.best}}</td>
        <td>{{item.worst}}</td>
      </tr>
    </table>

  </div>
</template>

<script>
import { getEnterpriseRanking } from "@/api/loam/big-data";

export default {
  data() {
    return {     
      tableData: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: { 	
    getTableData() {
      getEnterpriseRanking().then(res => {
        if(!res.data.success) {
          return;
        }
        let resData = res.data.data;
        let bestCompanies = resData.bestCompany ? resData.bestCompany.slice(0, 5) : [];
        let worstCompanies = resData.worstCompany ? resData.worstCompany.slice(0, 5) : [];
        let table_data = [];
        bestCompanies.forEach((item, index) => {
          table_data[index] = {
            best: (index + 1) + ". " + item.deptName,
            worst: ""
          };
        });
        worstCompanies.forEach((item, index) => {
          table_data[index] = {
              best: table_data[index].best ? table_data[index].best : "",
              worst: (index + 1) + ". " + item.deptName
            };
        });
        this.tableData = table_data;
        if(this.tableData.length !== 0) {
          let table = document.getElementById("rankTable");
          table.style.display = "table";
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.loam_company_rank {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(211, 211, 211, 0.1);
  border-radius: 3px;

  #header {
    color: #5f88f2;
    line-height: 34px;
    padding: 0 5px;
    text-align: left;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc;
  }

  .company_rank {
    width: 100%;
    height: calc( 100% - 44px );
    display: none;

    .table_head {
      td {
        color: #6189f2 !important;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid #2b3864;
        background: #23283b;
        padding-left: 5px;
      }
    }

    .table_body {
      td {
        color: #fff !important;
        border: 1px solid #2b3864;
        padding-left: 5px;
        background: #23283b;
      }
    }
  }
}
</style>