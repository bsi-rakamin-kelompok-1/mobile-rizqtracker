import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const TransactionItem = ({ transaction }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.date}>{transaction.date}</Text>
        <Text style={styles.description}>{transaction.description}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{transaction.type}</Text>
          {transaction.isSplit && (
            <TouchableOpacity style={styles.splitButton}>
              <Text style={styles.splitText}>Split Bill</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.amount}>{transaction.amount}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  leftContent: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    fontSize: 12,
    color: "#0E8A74",
    backgroundColor: "#F0F7F5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  splitButton: {
    marginLeft: 8,
  },
  splitText: {
    fontSize: 12,
    color: "#6B7280",
    textDecorationLine: "underline",
  },
  rightContent: {
    justifyContent: "center",
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E8A74",
  },
})

export default TransactionItem
