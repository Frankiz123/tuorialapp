import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Platform
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SearchBar, Card } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { BarChart, StackedBarChart } from "react-native-chart-kit";

export default function BarCharts(props) {
  const {
    userData,
    isCategory,
    isAlltutors,
    isThisTutor,
    totalaverage,
    q1average,
    q2average,
    q3average,
    q4average,
    q1allavg,
    q2allavg,
    q3allavg,
    q4allavg,
    q1catavg,
    q2catavg,
    q3catavg,
    q4catavg,
    allaverage,
    categoryaverage
  } = props;
  function* yLabel() {
    yield* [1, 2, 3, 4, 5];
  }
  function coloredText() {
    return <Text style={{ color: "red" }}>A</Text>;
  }
  const [strings, setstrings] = useState(["        A", "    B", "    C"]);
  let stringtext = coloredText();
  const ylabeliterator = yLabel();
  let string = "A";
  console.log(isCategory, isAlltutors, isThisTutor);
  return (
    <SafeAreaView>
      {isCategory === true && isAlltutors === false && isThisTutor === false ? (
        <ScrollView
          contentContainerStyle={{ height: "auto", width: "127%" }}
          style={{ height: 245, width: "auto", bottom: 50 }}
          horizontal={true}
        >
          <StackedBarChart
            data={{
              labels: [
                "B    "
                // "",
                // "",
                // "  B                    ",
                // "",
                // "",
                // "B                             ",
                // "",
                // "",
                // "  B                                            ",
                // " ",
                // "B                                 ",
                // " ",
              ],
              legend: [],

              data: [
                [parseFloat(categoryaverage).toFixed(1)],

                ["0.0"],

                [parseFloat(q1catavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q2catavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q3catavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q4catavg).toFixed(1)],

                ["5.0"]
              ],

              barColors: ["#F1C411", "#7a0000"]
            }}
            barPercentage={1}
            width={500}
            height={250}
            key={["positive", "negative"]}
            segments={5}
            fromNumber={0}
            style={{
              marginTop: 0,
              right: 0,
              width: 455,
              marginHorizontal: 10,
              left: 0
            }}
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              paddingRight: 10,
              backgroundColor: "#333939",
              backgroundGradientFrom: "#333939",
              backgroundGradientTo: "#333939",
              verticalLabelsHeightPercentage: 10,
              paddingRight: 10,
              width: 150,
              paddingTop: 10,
              propsForVerticalLabels: {
                fontStyle: "italic"
              },
              formatYLabel: () => ylabeliterator.next().value,
              scrollableInfoSize: 120,

              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              barPercentage: 0.5,
              strokeWidth: 1,
              style: {
                borderRadius: 16,
                color: "black",
                height: 150
              },
              linejoinType: "bevel"
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
            <Text style={{ color: "white", fontSize: 10.5, left: 17 }}>
              Overall
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 55 }}>
              Communcation
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 75 }}>
              Quality
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 110 }}>
              Work Ethics
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 10.5,
                left: 130,
                height: 60,
                textAlign: "center"
              }}
            >
              Subject {"\n"} Knowledge
            </Text>
          </View>
        </ScrollView>
      ) : isCategory === false &&
        isAlltutors === false &&
        isThisTutor === true ? (
        <ScrollView
          contentContainerStyle={{ height: "auto", width: "127%" }}
          style={{ height: 245, width: "auto", bottom: 50 }}
          horizontal={true}
        >
          <StackedBarChart
            data={{
              labels: [
                "A    "
                // "",
                // "",
                // "   A                    ",
                // "",
                // "",
                // "A                             ",
                // "",
                // "",
                // "  A                                            ",
                // " ",
                // "A                                 ",
                // " ",
              ],
              legend: [],

              data: [
                [parseFloat(totalaverage).toFixed(1)],

                ["0.0"],

                [parseFloat(q1average).toFixed(1)],

                ["0.0"],

                [parseFloat(q2average).toFixed(1)],

                ["0.0"],

                [parseFloat(q3average).toFixed(1)],

                ["0.0"],

                [parseFloat(q4average).toFixed(1)],

                ["5.0"]
              ],

              barColors: ["#F1C411", "#7a0000"]
            }}
            barPercentage={1}
            width={500}
            height={250}
            key={["positive", "negative"]}
            segments={5}
            fromNumber={0}
            style={{
              marginTop: 0,
              right: 0,
              width: 455,
              marginHorizontal: 10,
              left: 0
            }}
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              paddingRight: 10,
              backgroundColor: "#333939",
              backgroundGradientFrom: "#333939",
              backgroundGradientTo: "#333939",
              verticalLabelsHeightPercentage: 10,
              paddingRight: 10,
              width: 150,
              paddingTop: 10,
              propsForVerticalLabels: {
                fontStyle: "italic"
              },
              formatYLabel: () => ylabeliterator.next().value,
              scrollableInfoSize: 120,

              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              barPercentage: 0.5,
              strokeWidth: 1,
              style: {
                borderRadius: 16,
                color: "black",
                height: 150
              },
              linejoinType: "bevel"
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
            <Text style={{ color: "white", fontSize: 10.5, left: 17 }}>
              Overall
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 55 }}>
              Communcation
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 75 }}>
              Quality
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 110 }}>
              Work Ethics
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 10.5,
                left: 130,
                height: 60,
                textAlign: "center"
              }}
            >
              Subject {"\n"} Knowledge
            </Text>
          </View>
        </ScrollView>
      ) : isCategory === false &&
        isAlltutors === true &&
        isThisTutor === false ? (
        <ScrollView
          contentContainerStyle={{ height: "auto", width: "127%" }}
          style={{ height: 245, width: "auto", bottom: 50 }}
          horizontal={true}
        >
          <StackedBarChart
            data={{
              labels: [
                "C    ",
                "",
                "",
                "  C                    ",
                "",
                "",
                "C                             ",
                "",
                "",
                "  C                                            ",
                " ",
                "C                                 ",
                " "
              ],
              legend: [],

              data: [
                [parseFloat(allaverage).toFixed(1)],

                ["0.0"],

                [parseFloat(q1allavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q2allavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q3allavg).toFixed(1)],

                ["0.0"],

                [parseFloat(q4allavg).toFixed(1)],

                ["5.0"]
              ],

              barColors: ["#F1C411", "#7a0000"]
            }}
            barPercentage={1}
            width={500}
            height={250}
            key={["positive", "negative"]}
            segments={5}
            fromNumber={0}
            style={{
              marginTop: 0,
              right: 0,
              width: 455,
              marginHorizontal: 10,
              left: 0
            }}
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              paddingRight: 10,
              backgroundColor: "#333939",
              backgroundGradientFrom: "#333939",
              backgroundGradientTo: "#333939",
              verticalLabelsHeightPercentage: 10,
              paddingRight: 10,
              width: 150,
              paddingTop: 10,
              propsForVerticalLabels: {
                fontStyle: "italic"
              },
              formatYLabel: () => ylabeliterator.next().value,
              scrollableInfoSize: 120,

              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              barPercentage: 0.5,
              strokeWidth: 1,
              style: {
                borderRadius: 16,
                color: "black",
                height: 150
              },
              linejoinType: "bevel"
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
            <Text style={{ color: "white", fontSize: 10.5, left: 17 }}>
              Overall
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 55 }}>
              Communcation
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 75 }}>
              Quality
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 110 }}>
              Work Ethics
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 10.5,
                left: 130,
                height: 60,
                textAlign: "center"
              }}
            >
              Subject {"\n"} Knowledge
            </Text>
          </View>
        </ScrollView>
      ) : isCategory === true &&
        isAlltutors === true &&
        isThisTutor === false ? (
        <View>
          <ScrollView
            contentContainerStyle={{ height: "auto", width: "131.5%" }}
            style={{ height: 245, width: "auto", bottom: 50 }}
            horizontal={true}
          >
            <StackedBarChart
              data={{
                labels: [
                  "       " + "B" + "     " + "C    ",
                  "",
                  "",
                  "  " + "B" + "     " + "C           ",
                  "",
                  "",
                  "" + "B" + "     " + "C                    ",
                  "",
                  "",
                  "" + "B" + "     " + "C                                 ",
                  " ",
                  "" + "B" + "     " + "C                        ",
                  " "
                ],
                legend: [],

                data: [
                  [parseFloat(categoryaverage).toFixed(1)],
                  [parseFloat(allaverage).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q1catavg).toFixed(1)],
                  [parseFloat(q1allavg).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q2catavg).toFixed(1)],
                  [parseFloat(q2allavg).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q3catavg).toFixed(1)],
                  [parseFloat(q3allavg).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q4catavg).toFixed(1)],
                  [parseFloat(q4allavg).toFixed(1)],
                  ["5.0"]
                ],

                barColors: ["#F1C411", "#7a0000"]
              }}
              barPercentage={1}
              width={500}
              height={250}
              key={["positive", "negative"]}
              segments={5}
              fromNumber={0}
              style={{
                marginTop: 0,
                right: 0,
                width: 473,
                marginHorizontal: 10,
                left: 0
              }}
              xLabelsOffset={-10}
              fromZero
              chartConfig={{
                paddingRight: 10,
                backgroundColor: "#333939",
                backgroundGradientFrom: "#333939",
                backgroundGradientTo: "#333939",
                verticalLabelsHeightPercentage: 50,
                paddingRight: 10,
                width: 100,
                labels: ["A", "B", "C"],
                propsForVerticalLabels: {
                  fontStyle: "italic"
                },

                paddingTop: 10,
                formatYLabel: () => ylabeliterator.next().value,
                scrollableInfoSize: 120,

                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                barPercentage: 0.5,
                strokeWidth: 1,
                style: {
                  borderRadius: 16,
                  color: "black",
                  height: 150
                },
                linejoinType: "bevel"
              }}
            />
            <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
              <Text style={{ color: "white", fontSize: 10.5, left: 10 }}>
                Overall
              </Text>
              <Text style={{ color: "white", fontSize: 10.5, left: 45 }}>
                Communcation
              </Text>
              <Text style={{ color: "white", fontSize: 10.5, left: 70 }}>
                Quality
              </Text>
              <Text style={{ color: "white", fontSize: 10.5, left: 100 }}>
                Work Ethics
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 10.5,
                  left: 120,
                  height: 60,
                  textAlign: "center"
                }}
              >
                Subject {"\n"} Knowledge
              </Text>
            </View>
          </ScrollView>
        </View>
      ) : isCategory === false &&
        isThisTutor === true &&
        isAlltutors === true ? (
        <ScrollView
          contentContainerStyle={{ height: "auto", width: "130%" }}
          style={{ height: 245, width: "auto", bottom: 50 }}
          horizontal={true}
        >
          <StackedBarChart
            data={{
              labels: [
                "       " + "A" + "     " + "C    ",
                "",
                "",
                "  " + "A" + "     " + "C           ",
                "",
                "",
                "" + "A" + "     " + "C                    ",
                "",
                "",
                "" + "A" + "     " + "C                                 ",
                " ",
                "" + "A" + "     " + "C                        ",
                " "
              ],
              legend: [],

              data: [
                [parseFloat(totalaverage).toFixed(1)],
                [parseFloat(allaverage).toFixed(1)],
                ["0.0"],
                [parseFloat(q1average).toFixed(1)],
                [parseFloat(q1allavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q2average).toFixed(1)],
                [parseFloat(q2allavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q3average).toFixed(1)],
                [parseFloat(q3allavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q4average).toFixed(1)],
                [parseFloat(q4allavg).toFixed(1)],
                ["5.0"]
              ],

              barColors: ["#F1C411", "#7a0000"]
            }}
            barPercentage={1}
            width={500}
            height={250}
            key={["positive", "negative"]}
            segments={5}
            fromNumber={0}
            style={{
              marginTop: 0,
              right: 0,
              width: 470,
              marginHorizontal: 10,
              left: 0
            }}
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              paddingRight: 10,
              backgroundColor: "#333939",
              backgroundGradientFrom: "#333939",
              backgroundGradientTo: "#333939",
              verticalLabelsHeightPercentage: 50,
              paddingRight: 10,
              width: 100,
              labels: ["A", "B", "C"],
              propsForVerticalLabels: {
                fontStyle: "italic"
              },

              paddingTop: 10,
              formatYLabel: () => ylabeliterator.next().value,
              scrollableInfoSize: 120,

              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              barPercentage: 0.5,
              strokeWidth: 1,
              style: {
                borderRadius: 16,
                color: "black",
                height: 150
              },
              linejoinType: "bevel"
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
            <Text style={{ color: "white", fontSize: 10.5, left: 10 }}>
              Overall
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 50 }}>
              Communcation
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 70 }}>
              Quality
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 100 }}>
              Work Ethics
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 10.5,
                left: 130,
                height: 60,
                textAlign: "center"
              }}
            >
              Subject {"\n"} Knowledge
            </Text>
          </View>
        </ScrollView>
      ) : isCategory === true &&
        isThisTutor === true &&
        isAlltutors === false ? (
        <ScrollView
          contentContainerStyle={{ height: "auto", width: "130%" }}
          style={{ height: 245, width: "auto", bottom: 50 }}
          horizontal={true}
        >
          <StackedBarChart
            data={{
              labels: [
                "       " + "A" + "     " + "B    ",
                "",
                "",
                "  " + "A" + "     " + "B           ",
                "",
                "",
                "" + "A" + "     " + "B                    ",
                "",
                "",
                "" + "A" + "     " + "B                                 ",
                " ",
                "" + "A" + "     " + "B                        ",
                " "
              ],
              legend: [],

              data: [
                [parseFloat(totalaverage).toFixed(1)],
                [parseFloat(categoryaverage).toFixed(1)],
                ["0.0"],
                [parseFloat(q1average).toFixed(1)],
                [parseFloat(q1catavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q2average).toFixed(1)],
                [parseFloat(q2catavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q3average).toFixed(1)],
                [parseFloat(q3catavg).toFixed(1)],
                ["0.0"],
                [parseFloat(q4average).toFixed(1)],
                [parseFloat(q4catavg).toFixed(1)],
                ["5.0"]
              ],

              barColors: ["#F1C411", "#7a0000"]
            }}
            barPercentage={1}
            width={500}
            height={250}
            key={["positive", "negative"]}
            segments={5}
            fromNumber={0}
            style={{
              marginTop: 0,
              right: 0,
              width: 470,
              marginHorizontal: 10,
              left: 0
            }}
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              paddingRight: 10,
              backgroundColor: "#333939",
              backgroundGradientFrom: "#333939",
              backgroundGradientTo: "#333939",
              verticalLabelsHeightPercentage: 50,
              paddingRight: 10,
              width: 100,
              labels: ["A", "B", "C"],
              propsForVerticalLabels: {
                fontStyle: "italic"
              },

              paddingTop: 10,
              formatYLabel: () => ylabeliterator.next().value,
              scrollableInfoSize: 120,

              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              barPercentage: 0.5,
              strokeWidth: 1,
              style: {
                borderRadius: 16,
                color: "black",
                height: 150
              },
              linejoinType: "bevel"
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
            <Text style={{ color: "white", fontSize: 10.5, left: 10 }}>
              Overall
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 50 }}>
              Communcation
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 70 }}>
              Quality
            </Text>
            <Text style={{ color: "white", fontSize: 10.5, left: 100 }}>
              Work Ethics
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 10.5,
                left: 128,
                height: 60,
                textAlign: "center"
              }}
            >
              Subject {"\n"} Knowledge
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View>
          <ScrollView
            contentContainerStyle={{
              height: "auto",
              width: Platform.OS === "android" ? "230%" : "133%"
            }}
            style={{ height: 255, width: "auto", bottom: 50 }}
            horizontal={true}
          >
            <StackedBarChart
              data={{
                labels: [
                  "     " +
                    "                   A" +
                    "      " +
                    "    B" +
                    " " +
                    "           C",
                  "",
                  "",
                  "       " +
                    "         A" +
                    "     " +
                    "       B" +
                    "" +
                    "            C",
                  "",
                  "",
                  "       " + "A" + "    " + "B" + "   " + "   C      ",
                  " ",
                  "  ",
                  "              " +
                    "   A" +
                    "   " +
                    "    B" +
                    "   " +
                    "  C                   ",
                  " ",
                  "" + "A" + "   " + "B" + "   " + "C    ",
                  " ",
                  "A"
                ],
                legend: [],

                data: [
                  [parseFloat(totalaverage).toFixed(1)],
                  [parseFloat(categoryaverage).toFixed(1)],
                  [parseFloat(allaverage).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q1average).toFixed(1)],
                  [parseFloat(q1catavg).toFixed(1)],
                  [parseFloat(q1allavg).toFixed(1)],
                  [parseFloat(0.0).toFixed(1)],
                  [parseFloat(q2average).toFixed(1)],
                  [parseFloat(q2catavg).toFixed(1)],
                  [parseFloat(q2allavg).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q3average).toFixed(1)],
                  [parseFloat(q3catavg).toFixed(1)],
                  [parseFloat(q3allavg).toFixed(1)],
                  ["0.0"],
                  [parseFloat(q4average).toFixed(1)],
                  [parseFloat(q4catavg).toFixed(1)],
                  [parseFloat(q4allavg).toFixed(1)],
                  ["5.0"]
                ],
                barColors: ["#F1C411", "#7a0000"]
              }}
              barPercentage={1}
              width={850}
              height={230}
              key={["positive", "negative"]}
              segments={5}
              fromNumber={0}
              style={{
                marginTop: 10,
                right: 0,
                width: 470,
                marginHorizontal: 10,
                left: 0
              }}
              xLabelsOffset={0}
              fromZero
              chartConfig={{
                // paddingRight: 10,
                // backgroundColor: "#333939",
                // backgroundGradientFrom: "#333939",
                // backgroundGradientTo: "#333939",
                // verticalLabelsHeightPercentage: 50,
                // paddingRight: 10,
                // width: 100,
                // labels: ["A", "B", "C"],
                // // marginTop: -30,
                // propsForVerticalLabels: {
                //   fontStyle: "italic",

                // },

                // paddingTop: 0,
                // formatYLabel: () => ylabeliterator.next().value,
                // scrollableInfoSize: 120,
                // formatXLabel: () => {
                //   strings;
                // },
                // decimalPlaces: 2, // optional, defaults to 2dp
                // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                // barPercentage: 0.9,
                // strokeWidth: 1,
                // style: {
                //   borderRadius: 16,
                //   color: "black",
                //   height: 150,
                // },
                // linejoinType: "bevel",
                backgroundGradientFrom: "#aaa",
                backgroundGradientTo: "#aaa",
                barPercentage: 0.9,
                height: 5000,
                fillShadowGradient: `rgba(1, 122, 205, 1)`,
                fillShadowGradientOpacity: 1,
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
                style: {
                  borderRadius: 16
                },
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: "#e3e3e3",
                  strokeDasharray: "0"
                }
              }}
            />
            <View style={{ flexDirection: "row", marginTop: 220, right: 410 }}>
              <Text style={{ color: "#000", fontSize: 10.5, left: 50 }}>
                Overall
              </Text>
              <Text style={{ color: "#000", fontSize: 10.5, left: 150 }}>
                Communcation
              </Text>
              <Text style={{ color: "#000", fontSize: 10.5, left: 250 }}>
                Quality
              </Text>
              <Text style={{ color: "#000", fontSize: 10.5, left: 360 }}>
                Work Ethics
              </Text>
              <Text
                style={{
                  color: "#000",
                  fontSize: 10.5,
                  left: Platform.OS === "android" ? 470 : 130,
                  height: 60,
                  bottom: 3,
                  textAlign: "center"
                }}
              >
                Subject Knowledge
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
