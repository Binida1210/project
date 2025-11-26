import styled from 'styled-components';

export type SuffixInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  suffix?: string;
};

export function SuffixInput({ suffix, className, ...props }: SuffixInputProps) {
  return (
    <SuffixInputRoot className={className}>
      <Input {...props} />
      {suffix && (
        <Suffix>
          <p>{suffix}</p>
        </Suffix>
      )}
    </SuffixInputRoot>
  );
}

const SuffixInputRoot = styled.div`
  width: 100%;
  height: 3.125rem; 
  display: flex;
  border-radius: 0.375rem; 
  outline: 1px solid gray;
  padding: 0.85rem 0 0.85rem 0.75rem;
  box-sizing: border-box;

  &:focus-within {
    outline: -webkit-focus-ring-color auto 1px;
  }
`;
const Input = styled.input`
  border: 0;
  width: 100%;
  box-sizing: border-box;
  flex: 1 1 auto; 
  min-width: 0; 
  padding: 0;

  &:focus-visible,
  &:focus {
    outline: 0;
  }
`;

const Suffix = styled.div`
  flex: 0 0 auto; 
  text-align: center;
  color: rgb(128, 128, 128, 0.65);
  padding: 0 5px;

  ${SuffixInputRoot}:focus-within & {
    color: rgb(128, 128, 128, 1);
  }

  p {
    white-space: nowrap;
    margin: 0;
    font-size: 0.95rem;
  }
`;

