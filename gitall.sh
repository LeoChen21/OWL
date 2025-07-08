#!/bin/bash

# Git automation script with auto-commit and custom commit message options
# Usage: ./git-push.sh [options]
# Options:
#   -a, --auto     Use automatic commit message based on git status
#   -m, --message  Use custom commit message (will prompt for input)
#   -h, --help     Show this help message

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    echo "Git Automation Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -a, --auto        Use automatic commit message based on git status"
    echo "  -m, --message     Use custom commit message (will prompt for input)"
    echo "  -h, --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -a                    # Auto-generate commit message"
    echo "  $0 --auto                # Auto-generate commit message"
    echo "  $0 -m                    # Prompt for custom commit message"
    echo "  $0 --message             # Prompt for custom commit message"
    echo "  $0                       # Interactive mode (will ask for preference)"
    echo ""
}

# Function to generate automatic commit message
generate_auto_message() {
    print_status "Analyzing changes to generate commit message..."
    
    # Get git status info
    local modified_files=$(git status --porcelain | grep "^ M" | wc -l)
    local added_files=$(git status --porcelain | grep "^A" | wc -l)
    local deleted_files=$(git status --porcelain | grep "^ D" | wc -l)
    local untracked_files=$(git status --porcelain | grep "^??" | wc -l)
    
    # Get list of modified file types
    local file_types=$(git status --porcelain | grep -E "^\s*[MAD]" | awk '{print $2}' | grep -o '\.[^.]*$' | sort | uniq | tr '\n' ' ')
    
    # Generate message based on changes
    local message=""
    local changes=()
    
    if [ $added_files -gt 0 ]; then
        changes+=("add $added_files new file(s)")
    fi
    
    if [ $modified_files -gt 0 ]; then
        changes+=("update $modified_files file(s)")
    fi
    
    if [ $deleted_files -gt 0 ]; then
        changes+=("remove $deleted_files file(s)")
    fi
    
    if [ $untracked_files -gt 0 ]; then
        changes+=("include $untracked_files untracked file(s)")
    fi
    
    # Join changes with commas
    local change_summary=$(IFS=', '; echo "${changes[*]}")
    
    if [ ${#changes[@]} -eq 0 ]; then
        message="minor updates and improvements"
    else
        message="$change_summary"
    fi
    
    # Add file types if available
    if [ ! -z "$file_types" ]; then
        message="$message ($file_types)"
    fi
    
    # Capitalize first letter
    message="$(echo ${message:0:1} | tr '[:lower:]' '[:upper:]')${message:1}"
    
    echo "$message"
}

# Function to get custom commit message
get_custom_message() {
    echo ""
    read -p "Enter your commit message: " custom_message
    
    if [ -z "$custom_message" ]; then
        print_error "Commit message cannot be empty!"
        return 1
    fi
    
    echo "$custom_message"
}

# Function to confirm actions
confirm_action() {
    local message="$1"
    echo ""
    print_status "Commit message: '$message'"
    echo ""
    read -p "Do you want to proceed with: git add . && git commit && git push? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled by user."
        exit 0
    fi
}

# Function to execute git commands
execute_git_commands() {
    local commit_message="$1"
    
    print_status "Executing git commands..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
    
    # Check if there are any changes to commit
    if git diff --quiet && git diff --staged --quiet; then
        print_warning "No changes detected. Nothing to commit."
        exit 0
    fi
    
    # Add all files
    print_status "Adding all files (git add .)..."
    git add .
    print_success "Files added successfully"
    
    # Commit with message
    print_status "Committing changes..."
    git commit -m "$commit_message"
    print_success "Changes committed successfully"
    
    # Push to remote
    print_status "Pushing to remote repository..."
    git push
    print_success "Changes pushed successfully"
    
    echo ""
    print_success "All operations completed successfully! 🚀"
}

# Main script logic
main() {
    local mode=""
    local commit_message=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--auto)
                mode="auto"
                shift
                ;;
            -m|--message)
                mode="custom"
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # If no mode specified, ask user
    if [ -z "$mode" ]; then
        echo ""
        print_status "Git Automation Script"
        echo ""
        echo "Choose commit message option:"
        echo "1) Auto-generate commit message"
        echo "2) Enter custom commit message"
        echo "3) Cancel"
        echo ""
        read -p "Select option (1-3): " -n 1 -r choice
        echo ""
        
        case $choice in
            1)
                mode="auto"
                ;;
            2)
                mode="custom"
                ;;
            3)
                print_warning "Operation cancelled."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Exiting."
                exit 1
                ;;
        esac
    fi
    
    # Generate or get commit message based on mode
    case $mode in
        "auto")
            commit_message=$(generate_auto_message)
            if [ $? -ne 0 ]; then
                print_error "Failed to generate automatic commit message"
                exit 1
            fi
            ;;
        "custom")
            commit_message=$(get_custom_message)
            if [ $? -ne 0 ]; then
                exit 1
            fi
            ;;
    esac
    
    # Confirm action
    confirm_action "$commit_message"
    
    # Execute git commands
    execute_git_commands "$commit_message"
}

# Run main function with all arguments
main "$@"