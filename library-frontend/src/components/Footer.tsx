import { Footer, Link, Utility } from '@visa/nova-react';

export const DefaultFooter = () => {
  return (
    <Footer className="v-gap-15">
      <Utility vFlex vFlexWrap vFlexGrow vJustifyContent="between" vGap={42}>
        {`Copyright © ${new Date().getFullYear()} Roja Chekuri. All Rights Reserved`}
        <Utility tag="ul" vFlex vFlexWrap vGap={16}>
          <li>
            <Link href="https://github.com/RojaChekuri/BookDen" target="_blank" rel="noopener noreferrer">GitHub</Link>
          </li>
        </Utility>
      </Utility>
    </Footer>
  );
};