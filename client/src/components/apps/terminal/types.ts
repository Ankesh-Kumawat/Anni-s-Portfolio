import React from "react";

export interface Command {
    input: string;
    output: string | React.ReactNode;
}
