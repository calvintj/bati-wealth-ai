import { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import XAxisInformation from "./bar-chart-x-axis";

export default class FUMChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    const { quarterlyFUM, customerRisk } = this.props;
    const { windowWidth } = this.state;

    // Responsive settings
    const isMobile = windowWidth < 768;
    const chartHeight = isMobile ? 250 : 300;
    const barSize = isMobile ? 30 : 50;
    // Increase bottom margin further and tickMargin for extra space for XAxis labels
    const margin = isMobile
      ? { top: 20, right: 30, left: 30, bottom: 40 }
      : { top: 30, right: 50, left: 50, bottom: 50 };

    const filterKey = customerRisk === "All" ? "All" : customerRisk;

    const data =
      quarterlyFUM && quarterlyFUM.length
        ? quarterlyFUM.filter((entry) => entry.name.startsWith(filterKey))
        : [];

    return (
      <div style={{ padding: "1rem" }}>
        <h3 className="text-white text-xl md:text-2xl font-bold mb-4 text-center">
          FUM per Kuartal
        </h3>

        <ResponsiveContainer height={chartHeight}>
          <BarChart data={data} margin={margin}>
            <XAxis
              dataKey="name"
              axisLine={true}
              tickLine={true}
              tick={<XAxisInformation data={data} />}
              stroke="#FFFFFF"
              interval={0}
              tickMargin={25} // increased tick margin for extra spacing
            />

            <YAxis
              tickFormatter={(tick) => (tick / 1000000).toLocaleString()}
              tick={true}
              axisLine={true}
              stroke="#FFFFFF"
            >
              <Label
                value="(in millions)"
                angle={-90}
                position="insideLeft"
                style={{ fill: "#FFFFFF", textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
              contentStyle={{
                border: "none",
                borderRadius: "1rem",
              }}
              labelStyle={{ color: "black" }}
              formatter={(val) => [val.toLocaleString(), "FUM"]}
              labelFormatter={() => ""}
            />

            <Bar dataKey="value" barSize={barSize} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#2ABC36" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

FUMChart.propTypes = {
  quarterlyFUM: PropTypes.array.isRequired,
  customerRisk: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ]).isRequired,
  setCustomerRisk: PropTypes.func.isRequired,
};
