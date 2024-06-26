const unmangleStoryName = (storyName: string): string => {
    return storyName.replaceAll('-', ' ').replace(/(?<=\s)\b\w/g, c => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase());
}
export default unmangleStoryName;