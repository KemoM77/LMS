import { render, screen } from '@testing-library/react';
import Header from './header';

describe('Header Component', () => {
  test('renders Header component with passed props', () => {
    const heading = 'Sample Heading';
    const paragraph = 'Sample Paragraph ';
    const linkName = 'Click Me';
    const linkUrl = '/sample-url';

    render(<Header heading={heading} paragraph={paragraph} linkName={linkName} linkUrl={linkUrl} />);

    // Check if heading is rendered
    const headingElement = screen.getByText(heading);
    expect(headingElement).toBeInTheDocument();

    // // Check if paragraph is rendered
    const paragraphAndLinkElements = screen.queryAllByText(/(Sample Paragraph|Click Me)/);
    expect(paragraphAndLinkElements.length).toBe(2);
    paragraphAndLinkElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });

    // Check if link is rendered with the correct text and href
    const linkElement = screen.getByText(linkName);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', linkUrl);

    // Check if MenuBookIcon is rendered
    const menuBookIcon = screen.getByTestId('MenuBookIcon');
    expect(menuBookIcon).toBeInTheDocument();
  });
});
