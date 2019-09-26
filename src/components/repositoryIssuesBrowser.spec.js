// @flow
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import * as React from "react";
import RepositoryIssuesBrowser from "./repositoryIssuesBrowser";
import type { Repository, Issue } from "./repositoryIssuesBrowser";
import { ListGroupItem } from "./listGroup";

describe("<RepositoryIssuesBrowser />", () => {
  function findByText(text:string, wrapper:ReactWrapper<any>): ReactWrapper<any> {
    return wrapper.findWhere(n => {
      return n.text() === text
    }).first();
  }

  // function clickItemText(text:string, wrapper:ReactWrapper<any>): ReactWrapper<any> {
  //   findByText(text, wrapper).simulate("click");
  //   return findByText(text, wrapper);
  // }

  describe("when repository data is available", () => {
    it("shows a list of repository names", () => {
      const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
      const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);

      expect(findByText("Repo 1", wrapper)).toExist();
      expect(findByText("Repo 2", wrapper)).toExist();
    });

    it("shows a list of repository names 2", () => {
      const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
      const wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper.find(ListGroupItem).first().props().children).toEqual("Repo 1");
      expect(wrapper.find(ListGroupItem).last().props().children).toEqual("Repo 2");
    });

    it("shows a summary of all open issues", () => {
      const issues1: Issue[] = [
        { title: "Repo 1 - Issue 1", isOpen: true },
        { title: "Repo 1 - Issue 2", isOpen: false }
      ];

      const issues2: Issue[] = [
        { title: "Repo 2 - Issue 1", isOpen: true },
        { title: "Repo 2 - Issue 2", isOpen: false }
      ];

      const repos: Repository[] = [
        {
          name: "Repo 1",
          issues: issues1
        },
        {
          name: "Repo 2",
          issues: issues2
        }
      ];

      let wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper).toIncludeText("Total open issues: 2");

      issues1[0].isOpen = false;

      wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper).toIncludeText("Total open issues: 1");
    });

    describe("and there are open issues in a repo", () => {
      it("shows the count of opened issues next to the repo name", () => {
        const repos: Repository[] = [
          {
            name: "Repo 1",
            issues: [
              { title: "Repo 1 - Issue 1", isOpen: true },
              { title: "Repo 1 - Issue 2", isOpen: true }
            ]
          },
          {
            name: "Repo 2",
            issues: [
              { title: "Repo 2 - Issue 1", isOpen: true },
              { title: "Repo 2 - Issue 2", isOpen: false }
            ]
          }
        ];

        const wrapper = shallow(
          <RepositoryIssuesBrowser repositories={repos} />
        );

        expect(
          wrapper
            .find(ListGroupItem)
            .first()
            .props().children
        ).toEqual("Repo 1 (2)");
        expect(
          wrapper
            .find(ListGroupItem)
            .last()
            .props().children
        ).toEqual("Repo 2 (1)");
      });
    });

    describe("and when a repo is clicked", () => {
      const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
      let wrapper: ShallowWrapper<typeof RepositoryIssuesBrowser>;
      let item1: ReactWrapper<typeof ListGroupItem>;
      let item2: ReactWrapper<typeof ListGroupItem>;

      const getFirstItem = ():ReactWrapper<typeof ListGroupItem> => wrapper.find(ListGroupItem).first();
      const getLastItem = ():ReactWrapper<typeof ListGroupItem> => wrapper.find(ListGroupItem).last();

      beforeEach(() => {
        wrapper = shallow(
          <RepositoryIssuesBrowser repositories={repos} />
        );
        item1 = getFirstItem();
        item2 = getLastItem();

        expect(item1).toHaveProp("active", false);
        expect(item2).toHaveProp("active", false);
      });

      describe("and it is NOT selected", () => {
        it("selects the clicked item", () => {
          item1.simulate("click");

          item1 = getFirstItem();
          item2 = getLastItem();

          expect(item1).toHaveProp("active", true);
          expect(item2).toHaveProp("active", false);
        });

        it("deselects any other selected item - single selection", () => {
          item1.simulate("click");

          item1 = getFirstItem();
          item2 = getLastItem();

          expect(item1).toHaveProp("active", true);
          expect(item2).toHaveProp("active", false);

          item2.simulate("click");

          item1 = getFirstItem();
          item2 = getLastItem();

          expect(item1).toHaveProp("active", false);
          expect(item2).toHaveProp("active", true);
        });
      });

      describe("and it IS selected", () => {
        it("deselects the clicked item", () => {
          item1.simulate("click");
          
          item1 = getFirstItem();
          item2 = getLastItem();

          expect(item1).toHaveProp("active", true);
          expect(item2).toHaveProp("active", false);

          item1.simulate("click");
          
          item1 = getFirstItem();
          item2 = getLastItem();

          expect(item1).toHaveProp("active", false);
          expect(item2).toHaveProp("active", false);
        });
      });
    });

    describe("when a repository with open issues is selected", () => {
      it("shows its list of OPEN issues", () => {
        const repos: Repository[] = [
          {
            name: "Repo 1",
            issues: [
              { title: "Repo 1 - Issue 1", isOpen: true },
              { title: "Repo 1 - Issue 2", isOpen: false }
            ]
          },
          { name: "Repo 2" }
        ];
        const wrapper = shallow(
          <RepositoryIssuesBrowser repositories={repos} />
        );
        
        wrapper.find(ListGroupItem).first().simulate("click");

        expect(wrapper.find("SelectedRepoIssues").dive().find(ListGroupItem).props().children).toEqual("Repo 1 - Issue 1");
      });
    });
  });
});
