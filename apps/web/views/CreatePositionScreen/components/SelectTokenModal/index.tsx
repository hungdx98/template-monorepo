import { Input } from "@/components/Input";
import { Token } from "@repo/utils/types";
import _get from "lodash/get";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import TokenItem from "../TokenItem";

interface SelectTokenModalProps {
  listToken?: Token[];
  onSelectToken: (token: any) => void;
}

const SelectTokenModal = (props: SelectTokenModalProps) => {
  const { onSelectToken } = props;
  const listToken = props.listToken

  const [search, setSearch] = useState("");

  const t = useTranslations();

  const filteredTokens = useMemo(() => {
    return listToken?.filter((token) => {
      const tokenName = _get(token, 'name', '').toLowerCase();
      const tokenSymbol = _get(token, 'symbol', '').toLowerCase();
      return (
        tokenName.includes(search.toLowerCase()) ||
        tokenSymbol.includes(search.toLowerCase())
      );
    });
  }, [search, listToken]);

  const handleSelectToken = (token: Token) => () => {
    onSelectToken(token);
    window.closeModal();
  }

  return (
    <div className="text-white rounded-xl space-y-4">
      {/* Search Bar */}
      {/* <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg>
        <input
          type="text"
          className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
          placeholder="Search tokens"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        isSearch
        placeholder={t('search_token')}
      />

      {/* Token Shortcuts */}
      {/* <div className="flex space-x-2 overflow-x-auto">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-gray-800 text-sm px-4 py-1 rounded-full whitespace-nowrap"
          >
            {token.symbol}
          </div>
        ))}
      </div> */}

      {/* Recent Searches */}
      {/* {recent.length > 0 && (
        <div>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
            <span>Recent searches</span>
            <button onClick={clearRecent} className="hover:underline text-gray-500">Clear</button>
          </div>
          <div className="space-y-1">
            {recent.map((token, idx) => (
              <div key={idx} className="flex items-center text-white text-sm">
                {token}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Token List by 24H Volume */}
      <div>
        <div className="text-sm  text-gray-400 mb-2">{t("tokens")}</div>
        <div className="space-y-2 overflow-y-auto pr-1 max-h-96">
          {filteredTokens?.map((token, idx) => (
            <div key={idx} onClick={handleSelectToken(token)} >
              <TokenItem
                key={idx}
                token={token}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTokenModal;
