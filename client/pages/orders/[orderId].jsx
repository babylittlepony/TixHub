import { useState, useEffect } from "react"
import StripeCheckout from "react-stripe-checkout"
import useRequest from "../../hooks/use-request"

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date() // Calculate the miliseconds left on the order
      setTimeLeft(Math.round(msLeft / 1000)) // Format the ms to seconds
    }

    findTimeLeft() // Call immediately to instantly show the seconds
    const timerId = setInterval(findTimeLeft, 1000) // Call timer every seconds
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
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51MCimNFj3dASAkzQHOOosOGHB2REMeD0bDC7lIKheyinivVRGCFwrZXSFp3JyuG9Oi6Z7HOxgBfpGgvknyTR4eKa00u9EFbbRT"
        amount={order.ticket.price * 1000} // In cent
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
