import React, { useEffect, useState } from "react";
import { getAllCompanies } from "../services/company";

export default function useCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCompanies();
      setCompanies(response?.result);
    } catch (e) {
      throw new Error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { isLoading, companies };
}
