import { View, Text, StyleSheet } from "react-native";
import { auth } from "../../firebase";
import { useRouter } from 'expo-router';
import { LineChart } from "react-native-gifted-charts";

import { test_data } from "@/test_data";

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;

  const ptData =test_data

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.email}>Welcome, {user.email}</Text>
          <LineChart
          areaChart
          data={ptData}
          rotateLabel
          width={300}
          hideDataPoints
          spacing={10}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={6}
          maxValue={600}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="gray"
          yAxisTextStyle={{color: 'gray'}}
          yAxisSide='right'
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: items => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -30,
                    marginLeft: -40,
                  }}>
                  <Text style={{color: 'white', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                    {items[0].date}
                  </Text>
                  <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
        </View>
        
        
      ) : (
        <Text style={styles.guestText}>Welcome, Guest User!</Text>
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  guestText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  }
});