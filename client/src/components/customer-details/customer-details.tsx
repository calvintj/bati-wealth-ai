import { useCustomerDetails } from "../../hooks/customerDetails-hook/customerDetails";
import PropTypes from "prop-types";

export default function CustomerDetails({ customerID }) {
  const { data } = useCustomerDetails(customerID);
  <div className="row-span-1 bg-gray-700 rounded-2xl items-center flex justify-between p-2 font-bold">
    <h2 className="pl-2">Status</h2>
    <h2 className="pr-2">{data?.Priority_Private || "N/A"}</h2>
  </div>;

  <div className="row-span-1 bg-gray-700 rounded-2xl justify-between items-center flex p-2 font-bold">
    <h2 className="pl-2">Usia</h2>
    <h2 className="pr-2">{data?.Usia || "N/A"}</h2>
  </div>;

  <div className="row-span-1 bg-gray-700 rounded-2xl justify-between items-center flex p-2 font-bold">
    <h2 className="pl-2">Status Pernikahan</h2>
    <h2 className="pr-2">{data?.Status_Nikah || "N/A"}</h2>
  </div>;

  <div className="row-span-1 bg-gray-700 rounded-2xl justify-between items-center flex p-2 font-bold">
    <h2 className="pl-2">Profil Resiko</h2>
    <h2 className="pr-2">{data?.Risk_Profile || "N/A"}</h2>
  </div>;

  <div className="row-span-1 bg-gray-700 rounded-2xl justify-between items-center flex p-2 font-bold">
    <h2 className="pl-2">Vintage</h2>
    <h2 className="pr-2">{data?.Vintage || "N/A"}</h2>
  </div>;
}

CustomerDetails.propTypes = {
  customerID: PropTypes.string.isRequired,
};
