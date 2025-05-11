import axios from 'axios';
import React, { useState } from "react";

const baseUrl = "https://localhost:7052";



interface HttpProps {
  endpoint: string;
  jsonData?: object;
  params?: object;
}

// POST request function
const httpPost = async ({ endpoint, jsonData }: HttpProps): Promise<any> => {
 var token= await getToken();
  try {
    const response = await axios.post(baseUrl + endpoint, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// GET request function
const httpGet = async ({ endpoint, params }: HttpProps): Promise<any> => {
  var token= await getToken();
  try {
    const response = await axios.get(baseUrl + endpoint, {
      params,
      headers: {
        'Accept': 'application/json',
         'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
};

const httpPut = async ({ endpoint, jsonData }: HttpProps): Promise<any> => {
  var token= await getToken();
  try {
    const response = await axios.put(baseUrl + endpoint, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};


const getToken=async()=>{
  

  const response = await fetch(baseUrl+"/api/Token/GetToken", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add any required headers here, like authorization
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data.token;
  
};

export { httpPost, httpGet, httpPut };
