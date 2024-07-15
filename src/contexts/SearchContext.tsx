"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type TabContextData = {
  handleChangeSearch: (search: string) => void;
  search: string;
};

interface ISearchProviderProps {
  children: ReactNode
}

export const SearchContext = createContext({} as TabContextData);

export function SearchProvider({ children }: ISearchProviderProps) {
  const [search, setSearch] = useState("")

  async function handleChangeSearch(param: string) {
    setSearch(param)
  }

  return (
    <SearchContext.Provider value={{ search, handleChangeSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)


