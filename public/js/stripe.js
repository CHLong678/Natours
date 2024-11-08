/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51QInKKEgHvuahHUNGwGdV3EgDoSWfORlRY3A1QVoouUL0ACQ2cp4LB6SS0TuE1UopfJVtO5Nhn6u2g0L7ZTjwBbD00QpregcwN'
);

export const bookTour = async tourId => {
  try {
    // Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
