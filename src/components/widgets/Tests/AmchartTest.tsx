/* eslint-disable no-plusplus */
/* eslint-disable react/self-closing-comp */
import * as React from 'react';
import { PureComponent } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { widgetFactory } from '../IWidget';

interface IProps {}

class ChartWidget extends PureComponent<IProps> {
    props!: IProps;

    chart: any;

    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        const chart = am4core.create('demo-chart', am4charts.XYChart);

        chart.paddingRight = 20;

        const data: Array<{ [value: string]: any }> = [];
        let visits = 10;
        for (let i = 1; i < 366; i++) {
            visits += Math.round(
                (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10
            );
            data.push({
                date: new Date(2018, 0, i),
                name: `name${i}`,
                value: visits,
            });
        }

        chart.data = data;

        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        if (valueAxis.tooltip) {
            valueAxis.tooltip.disabled = true;
        }
        valueAxis.renderer.minWidth = 35;

        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';

        series.tooltipText = '{valueY.value}';
        chart.cursor = new am4charts.XYCursor();

        const scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div>
                <div id="demo-chart" className="widget"></div>
            </div>
        );
    }
}

const Widget = widgetFactory()(ChartWidget);
export default Widget;
