// @flow
import * as React from "react";
import { mount, shallow, ReactWrapper } from "enzyme";
import RepositoryIssuesBrowser from "./RepositoryIssuesBrowser";

describe("<RepositoryIssuesBrowser />", () => {
  function findByText(text:string, wrapper:ReactWrapper<any>): ReactWrapper<any> {
    return wrapper.findWhere(n => {
      return n.text() === text
    }).first();
  }

  function clickItemText(text:string, wrapper:ReactWrapper<any>): ReactWrapper<any> {
    findByText(text, wrapper).simulate("click");
    return findByText(text, wrapper);
  }

  it("renders a loading indicator when loading prop is truthy", () => {
    const wrapper = shallow(<RepositoryIssuesBrowser loading={true} />);

    expect(wrapper).toHaveText("loading repository data...");
  });

  describe("when repository data is available", () => {
    it("shows a list of repository names", () => {
      const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
      const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);

      expect(findByText("Repo 1", wrapper)).toExist();
      expect(findByText("Repo 2", wrapper)).toExist();
    });

    it("shows a summary of all open issues", () => {
      const repos = [
        {
          name: "Repo 1",
          issues: [
            { title: "Repo 1 - Issue 1", isOpen: true },
            { title: "Repo 1 - Issue 2", isOpen: false },
          ],
        },
        {
          name: "Repo 2",
          issues: [
            { title: "Repo 2 - Issue 1", isOpen: true },
            { title: "Repo 2 - Issue 2", isOpen: false },
          ],
        },
      ];

      let wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper).toIncludeText("Total open issues: 2");

      repos[0].issues[0].isOpen = false;

      wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper).toIncludeText("Total open issues: 1");
    });

    describe("and there are open issues in a repo", () => {
      it("shows the count of opened issues next to the repo name", () => {
        const repos = [
          {
            name: "Repo 1",
            issues: [
              { title: "Repo 1 - Issue 1", isOpen: true },
              { title: "Repo 1 - Issue 2", isOpen: true },
            ],
          },
          {
            name: "Repo 2",
            issues: [
              { title: "Repo 2 - Issue 1", isOpen: true },
              { title: "Repo 2 - Issue 2", isOpen: false },
            ],
          },
        ];

        const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);

        expect(findByText("Repo 1 (2)", wrapper)).toExist();
        expect(findByText("Repo 2 (1)", wrapper)).toExist();
      });
    });

    describe('and when a repo is clicked', () => {
      describe('and it is NOT selected', () => {
        it('selects the clicked item', () => {
          const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
          const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);
          let item1 = findByText("Repo 1", wrapper);

          expect(item1).toHaveProp('active', false);
          expect(findByText("Repo 2", wrapper)).toHaveProp('active', false);

          item1.simulate("click");
          item1 = findByText("Repo 1", wrapper);

          expect(item1).toHaveProp('active', true);
          expect(findByText("Repo 2", wrapper)).toHaveProp('active', false);
        });

        it('deselects any other selected item - single selection', () => {
          const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
          const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);
          let item1 = findByText("Repo 1", wrapper);
          let item2 = findByText("Repo 2", wrapper);

          expect(item1).toHaveProp('active', false);
          expect(item2).toHaveProp('active', false);

          item1 = clickItemText("Repo 1", wrapper);
          item2 = findByText("Repo 2", wrapper);

          expect(item1).toHaveProp('active', true);
          expect(item2).toHaveProp('active', false);

          item2 = clickItemText("Repo 2", wrapper);
          item1 = findByText("Repo 1", wrapper);

          expect(item1).toHaveProp('active', false);
          expect(item2).toHaveProp('active', true);
        });
      });

      describe('and it IS selected', () => {
        it('deselects the clicked item', () => {
          const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
          const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);
          let item1 = findByText("Repo 1", wrapper);
          let item2 = findByText("Repo 2", wrapper);
          
          expect(item1).toHaveProp('active', false);
          expect(item2).toHaveProp('active', false);

          item1.simulate("click");
          item1 = findByText("Repo 1", wrapper);

          expect(item1).toHaveProp('active', true);
          expect(item2).toHaveProp('active', false);

          item1.simulate("click");
          item1 = findByText("Repo 1", wrapper);

          expect(item1).toHaveProp('active', false);
          expect(item2).toHaveProp('active', false);
        });
      });
    });

    describe('when a repository with open issues is selected', () => {
      it('shows its list of issues', () => {
        const repos = [
          {
            name: "Repo 1",
            issues: [
              { title: "Repo 1 - Issue 1", isOpen: true },
              { title: "Repo 1 - Issue 2", isOpen: false },
            ],
          },
          { name: "Repo 2" },
        ];
        const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);
        clickItemText("Repo 1 (1)", wrapper)

        expect(findByText("Repo 1 - Issue 1", wrapper)).toExist();
        expect(findByText("Repo 1 - Issue 2", wrapper)).not.toExist();
      });
    });
  });
});
