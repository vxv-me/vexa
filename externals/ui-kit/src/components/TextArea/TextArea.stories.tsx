import React from "react";
import { Meta } from "@storybook/react";
import { Story } from "@storybook/react";

import Button, { ButtonProps } from "./TextArea";

export default {
  title: "Components/TextAria",
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { label: "Primary 😃", size: "l" };

export const Secondary = Template.bind({});
Secondary.args = { label: "Primary 😃", size: "l" };
