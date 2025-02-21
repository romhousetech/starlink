'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Country } from 'country-state-city';
import emailjs from 'emailjs-com';
import { Toaster, toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import Tag from './Tag';

// Dynamic import of Select to avoid SSR issues
const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

interface Option {
  value: string;
  label: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: null as Option | null,
    phone: '',
    email: '',
    message: '',
    contactPref: [] as Option[],
  });

  const [isCelebrating, setIsCelebrating] = useState(false);

  const convertToOptions = (
    data: string[] | any[],
    labelKey?: string,
    valueKey?: string
  ): Option[] => {
    if (Array.isArray(data) && data.length > 0) {
      if (typeof data[0] === 'string') {
        return data.map((item) => ({
          label: item,
          value: item,
        }));
      }
      return data.map((item) => ({
        label: item[labelKey || 'name'],
        value: item[valueKey || 'value'],
      }));
    }
    return [];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption: Option | null) => {
    setFormData({
      ...formData,
      nationality: selectedOption,
    });
  };

  const handleSelectChange = (
    field: string,
    selectedOptions: Option[] | null
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOptions || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToastId = toast.loading('Sending your message...');

    try {
      const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_KEY!;

      //console.log(serviceId, templateId, publicKey);

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment variables are not defined.');
      }

      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationality: formData.nationality?.label || 'N/A',
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          contactPref: formData.contactPref
            .map((sector) => sector.label)
            .join(', '),
        },
        publicKey
      );

      toast.dismiss(loadingToastId);

      if (response.status === 200) {
        toast.success('Message sent successfully!');
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 5000);

        setFormData({
          firstName: '',
          lastName: '',
          nationality: null,
          phone: '',
          email: '',
          message: '',
          contactPref: [],
        });
      } else {
        throw new Error('Failed to send the message.');
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to send the message. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <section className="py-24 p-20" id="contact">
      <div className="flex justify-center">
        <Tag>Contact Us</Tag>
      </div>
      <h2 className="text-6xl font-medium mt-6 text-center font-space max-w-xl mx-auto">
        Reach Out,
        <span className="text-primary"> We're Here to Help! </span>
      </h2>
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-md rounded-md p-12 mt-12 ">
        <form onSubmit={handleSubmit} className="">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-white/20  bg-gray-800 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border  border-white/20  bg-gray-800  rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="nationality"
              className="block text-sm font-medium mt-b"
            >
              Country
            </label>
            <DynamicSelect
              id="nationality"
              options={convertToOptions(
                Country.getAllCountries(),
                'name',
                'isoCode'
              )}
              value={formData.nationality || null}
              onChange={(newValue) =>
                handleCountryChange(newValue as Option | null)
              }
              className="border-white/20  bg-gray-800 "
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#1F2937',
                  borderColor: '#4A4A4A',
                  color: '#FFF',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#FFF',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#252525',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#3498db' : 'transparent',
                  color: '#FFF',
                }),
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300  border-white/20  bg-gray-800 "
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300  border-white/20  bg-gray-800"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="contactPref"
              className="block text-sm font-medium mb-1"
            >
              Contact Preference
            </label>
            <DynamicSelect
              id="contactPref"
              isMulti
              options={convertToOptions(['Email', 'Phone Call'])}
              value={formData.contactPref}
              onChange={(newValue) =>
                handleSelectChange('contactPref', newValue as Option[])
              }
              className=" border-white/20  bg-gray-800 "
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#1F2937',
                  borderColor: '#4A4A4A',
                  color: '#FFF',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#FFF',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#252525',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#3498db' : 'transparent',
                  color: '#FFF',
                }),
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300  border-white/20  bg-gray-800 "
              rows={4}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue text-white bg-primary hover:bg-secondary font-bold py-3 px-5 rounded-md transition-all duration-300"
          >
            Send
          </button>
        </form>

        <Toaster position="top-center" reverseOrder={false} />
        {isCelebrating && <Confetti />}
      </div>
    </section>
  );
};

export default ContactForm;
