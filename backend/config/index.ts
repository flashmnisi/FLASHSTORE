import express  from "express"
import 'dotenv/config'

export const MONGO_URI = process.env.MONGO_URI


export const PORT = process.env.PORT || 8000
console.log("my port is ",PORT)
export const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID
export const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET