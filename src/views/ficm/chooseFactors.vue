<template>
  <div>
    <el-dialog
      title="选择因子"
      append-to-body
      :visible.sync="addFactorVisable"
      :close-on-click-modal="false"
      width="700px"
    >
      <!-- <avue-form :option="debugOption" v-model="debugForm"/> -->
      <avue-crud
        :option="factorOption"
        :data="factorData"
        @selection-change="auSelectionChange"
        ref="auCrud"
      ></avue-crud>
      <div class="add_relation_footer">
        <el-button type="primary" size="small" @click="addFactorsConfirm()"
          >确定</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="closeDialog()"
        >
          关 闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFactorByCode,
  addBatchMsFactors,
} from "@/api/ficm/deviceinfo";

export default {
  props: {
    addFactorVisable: { default: false },
    siteType: { default: "" },
  },
  data() {
    return {
      selectFactorList:[],
      factorData: [],
      factorOption: {
        calcHeight: 30,
        tip: false,
        index: true,
        border:true,
        selection: true,
        addBtn: false,
        index: true,
        refreshBtn: false,
        columnBtn: false,
        menu: false,
        column: [
          {
            label: "因子编码",
            prop: "factorCodeId",
            align: "center",
          },
          {
            label: "因子名称",
            prop: "name",
            align: "center",
          },
        ],
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    closeDialog(){
      this.$emit("closeDialog");
    },
    // 初始化评估历史弹窗
    initData() {
      this.auOnload();
    },
    // 获取因子列表
    auOnload() {
      let st = localStorage.getItem('systemType');
      getFactorByCode(st).then((res) => {
        this.factorData = res.data.data;
      });
    },
    auSelectionChange(list) {
      this.selectFactorList = list;
    },
    addFactorsConfirm() {
      let tenantFactorIds = "";
      this.selectFactorList.forEach((el) => {
        tenantFactorIds += el.id+',';
      });
    tenantFactorIds= tenantFactorIds.substr(0,tenantFactorIds.length-1);
      addBatchMsFactors(tenantFactorIds,this.siteType).then((res) => {
        this.$message({
          type: "success",
          message: "批量添加因子成功!",
        });
      });
      this.$emit("closeDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.add_relation_footer {
  text-align: right;
}
</style>