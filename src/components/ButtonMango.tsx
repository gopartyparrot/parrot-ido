import { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledButton = styled.button<ButtonProps>`
  :before {
    ${tw`absolute left-0 top-0 opacity-0 h-full w-full block transition-opacity duration-500`}
    ${({ gray }) => (gray ? tw`bg-default` : tw`bg-default`)}
    border-radius: inherit;
    content: '';
    z-index: -10;
  }

  :hover {
    :before {
      ${tw`opacity-100`}
    }
  }

  :focus {
    ${tw`ring-2 ring-opacity-40 outline-none`}
  }

  :active {
    :before {
      ${tw`ring-2 ring-opacity-40`}
    }
  }

  :disabled {
    ${tw`cursor-not-allowed opacity-60`}
    :before {
      ${tw`hidden`}
    }
  }
`;

interface ButtonProps {
  className?: string;
  gray?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  gray,
  ...props
}) => {
  return (
    <StyledButton
      className={`${className} relative z-10 px-8 py-2 rounded-full text-fgd-1 font-bold `}
      gray={gray}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
