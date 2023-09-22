<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add()"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ hint }}
          </span>
          <!-- <span
              TODO: create autocomplete
              </span> -->
        </div>
        <template v-if="massage()">
          <div class="text-sm text-red-600">Такой тикер уже добавлен</div>
        </template>
      </div>
    </div>
    <add-button @click="add()" />
  </section>
</template>

<script>
import addButton from "./addButton.vue";
export default {
  components: {
    addButton,
  },

  props: ["tickers"],

  data() {
    return {
      hint: [],
      ticker: "",
    };
  },

  methods: {
    add() {
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },

    massage() {
      let res = false;
      this.tickers.forEach(() => {
        if (
          this.tickers.find(
            (t) => t.name.toUpperCase() === this.ticker.toUpperCase()
          )
        ) {
          res = true;
        } else {
          res = false;
        }
      });
      this.$emit("message", res);
      return res;
    },
  },
};
</script>

<style></style>
