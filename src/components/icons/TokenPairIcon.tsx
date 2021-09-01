import React from 'react';

import TokenIcon from './TokenIcon';

interface TokenPairIconProps {
  icons: [string, string];
  symbols: [string, string];
}

const TokenPairIcon: React.FC<TokenPairIconProps> = ({ icons, symbols }) => {
  const [icon1, icon2] = icons;
  const [symbol1, symbol2] = symbols;

  return (
    <div className="flex flex-row items-center flex-shrink-0">
      <div
        style={{ borderWidth: '1px' }}
        className="z-10 bg-lightgray rounded-full overflow-hidden border-white"
      >
        <TokenIcon
          className="select-none"
          icon={icon1}
          size="32"
          symbol={symbol1}
        />
      </div>
      <div className="transform -translate-x-2 bg-lightgray overflow-hidden rounded-full">
        <TokenIcon
          className="select-none"
          icon={icon2}
          size="32"
          symbol={symbol2}
        />
      </div>
    </div>
  );
};

export default TokenPairIcon;
