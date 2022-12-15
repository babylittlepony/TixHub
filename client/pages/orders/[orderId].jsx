import { useState, useEffect } from "react"

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date() // Calculate the miliseconds left on the order
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId) // Turn off the timer when user no longer in the component
    }
  }, [])

  if (timeLeft < 0) {
    return (
      <div>
        <p>Order expired</p>
      </div>
    )
  }

  return (
    <div>
      <p>Time left to pay: {timeLeft} seconds</p>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
