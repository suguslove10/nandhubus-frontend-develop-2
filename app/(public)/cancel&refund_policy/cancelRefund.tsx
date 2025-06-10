"use client"
import React from 'react';

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            NandhuBus Cancellation Policy
          </h1>
          
          <div className="space-y-6">
            {/* 30+ Days Cancellation */}
            <section>
              <h2 className="text-lg font-semibold text-blue-700 mb-4">
                Cancellations Made 30 Days or More Before the Scheduled Departure
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  A full refund of the booking amount will be provided. No cancellation charges will be applied.
                </p>
              </div>
            </section>

            {/* 7-29 Days Cancellation */}
            <section>
              <h2 className="text-lg font-semibold text-green-700 mb-4">
                Cancellations Made Between 7 to 29 Days Before the Scheduled Departure
              </h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  A partial refund will be processed after deducting applicable platform or processing fees.
                </p>
              </div>
            </section>

            {/* Within 7 Days Cancellation */}
            <section>
              <h2 className="text-lg font-semibold text-red-700 mb-4">
                Cancellations Made Within 7 Days of the Scheduled Departure
              </h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  No refund will be provided for cancellations made within this period, including same-day cancellations and no-shows.
                </p>
              </div>
            </section>

            {/* General Policy Statement */}
            <section>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">
                  At NandhuBus, we strive to provide a reliable and customer-friendly travel experience. 
                  We understand that plans may change, and our cancellation policy is designed to offer 
                  clarity and fairness to all customers.
                </p>
              </div>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              For any questions or clarifications, please contact our customer support:
            </p>
            <p className="text-blue-600 font-semibold mt-2">
              Email: support@nandhubus.com | Phone: +91 7090007776
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}