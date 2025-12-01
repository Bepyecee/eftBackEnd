package com.example.investmenttracker.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YahooFinanceResponse {

    @JsonProperty("chart")
    private Chart chart;

    public Chart getChart() {
        return chart;
    }

    public void setChart(Chart chart) {
        this.chart = chart;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Chart {
        @JsonProperty("result")
        private List<Result> result;

        @JsonProperty("error")
        private Object error;

        public List<Result> getResult() {
            return result;
        }

        public void setResult(List<Result> result) {
            this.result = result;
        }

        public Object getError() {
            return error;
        }

        public void setError(Object error) {
            this.error = error;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        @JsonProperty("meta")
        private Meta meta;

        public Meta getMeta() {
            return meta;
        }

        public void setMeta(Meta meta) {
            this.meta = meta;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta {
        @JsonProperty("currency")
        private String currency;

        @JsonProperty("symbol")
        private String symbol;

        @JsonProperty("regularMarketPrice")
        private Double regularMarketPrice;

        @JsonProperty("previousClose")
        private Double previousClose;

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getSymbol() {
            return symbol;
        }

        public void setSymbol(String symbol) {
            this.symbol = symbol;
        }

        public Double getRegularMarketPrice() {
            return regularMarketPrice;
        }

        public void setRegularMarketPrice(Double regularMarketPrice) {
            this.regularMarketPrice = regularMarketPrice;
        }

        public Double getPreviousClose() {
            return previousClose;
        }

        public void setPreviousClose(Double previousClose) {
            this.previousClose = previousClose;
        }
    }
}
