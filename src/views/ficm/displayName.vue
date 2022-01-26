<template>
  <div class="lc_wrap">
    <el-row class="displayName">
      <el-col :span="24">
        <basic-container>
          <avue-crud
            :option="option"
            :table-loading="loading"
            :data="data"
            ref="crud"
            @row-update="rowUpdate"
            @on-load="onLoad"
          >
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                icon="el-icon-refresh-left"
                size="small"
                @click.stop="handleRestore(scope.row, scope.index)"
                >还原</el-button
              >
            </template>
          </avue-crud>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMenus, updateMenu } from "@/api/ficm/displayName";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      option: {
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        dialogClickModal: false,
        refreshBtn: false,
        delBtn: false,
        header: false,
        column: [
          {
            label: "系统名称",
            prop: "originalName",
            editDisabled: true
          },
          {
            label: "系统别名",
            prop: "alias",
            rules: [
              {
                required: true,
                message: "请填写系统别名",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    // 修改别名
    rowUpdate(form, index, done, loading) {
      var updateData = { code: form.code, id: form.id, alias: form.alias };
      this.updateRootMenu(updateData, "编辑成功!", done, loading);
    },

    // 还原别名
    handleRestore(form, index, done, loading) {
      var updateData = { code: form.code, id: form.id, alias: "" };
      this.updateRootMenu(updateData, "还原成功!", done, loading);
    },

    // 更新数据
    updateRootMenu(data, msg, done, loading) {
      updateMenu(data).then(
        () => {
          this.onLoad();
          this.$message({
            type: "success",
            message: msg
          });
          done();
        },
        error => {
          loading();
        }
      );
    },

    // 获取表格数据
    onLoad() {
      this.loading = true;
      getMenus().then(res => {
        var resData = res.data.data;
        this.data = resData.records;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss">
.anchorBL {
  display: none;
}

.displayName {
  .el-card__body {
    height: calc(100% - 35px);

    .avue-crud {
      height: calc(100% - 105px);
    }
  }
}
</style>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
}

.box {
  height: 100%;
}

.el-row {
  height: calc(100% - 20px);
}

.el-col {
  height: 100%;
  overflow: auto;
}

.overlay {
  position: absolute;
  width: 200px;
  height: 100%;
  opacity: 0;
  display: flex;
  align-items: center;
  padding-left: 6px;

  .tree-tool {
    height: 34px;
    width: 18px;
    background: #fff;
    box-shadow: 2px 1px 4px #ccc;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;
    display: flex;
    padding: 6px 0;
    z-index: 9999;

    .tool-line {
      margin-left: 3px;
      height: 100%;
      border-left: 1px solid #ddd;
    }
  }
}

.overlay:hover {
  opacity: 1;
}
</style>