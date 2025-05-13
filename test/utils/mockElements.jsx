// components from "Tailwind Elements" cannot be imported into test files or run in a test DOM environment,
// so the next best thing is to approximate them with crude fakes, which kinda half defeats the purpose but... yeah, what else is there?

// TEInput
export function mockTEInput(...args) {
  const { label, ...rest } = { ...args["0"] };
  return (
    <>
      <input {...rest} />
      <label htmlFor={rest.id}>{label}</label>
    </>
  );
}

// TEModal, TEModalDialog, TEModalContent, TEModalBody, TECollapse
export function mockDiv({ children, key, ...args }) {
  return <div key={key}>{children}</div>;
}
