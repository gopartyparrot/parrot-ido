import React from 'react';

interface IProps {
  analyticsID: string;
}

const ScriptAnalytics = ({ analyticsID }: IProps) => {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
 window.dataLayer = window.dataLayer || [];
 function gtag(){dataLayer.push(arguments);}
 gtag('js', new Date());
 gtag('config', '${analyticsID}');`
        }}
      ></script>
    </>
  );
};

export default ScriptAnalytics;
